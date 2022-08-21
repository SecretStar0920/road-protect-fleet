import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, CreditGuardToken, Log, LogPriority, LogType } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CREDIT_GUARD_INTEGRATION_MAP } from '@integrations/credit-guard/credit-guard-integration-map';
import { CreditGuardIntegrationType } from '@integrations/credit-guard/credit-guard.integration';
import { v4 } from 'uuid';
import { isNil } from 'lodash';
import { CreditGuardTokenDetails } from '@modules/payment/dtos/credit-guard-token.details';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
/**
 * Manages generating credit guard tokens and storing them
 */
export class CreditGuardTokenService {
    constructor(private logger: Logger) {}

    @Transactional()
    async generateTokenisationUrl(type: CreditGuardIntegrationType, accountId: number): Promise<string> {
        this.logger.log({ message: 'Requesting a token url', detail: { type, accountId }, fn: this.generateTokenisationUrl.name });
        const integration = CREDIT_GUARD_INTEGRATION_MAP[type];
        // Create a pending credit guard token
        const uniqueRef = v4();
        const token = await CreditGuardToken.create({
            paymentReference: uniqueRef,
        }).save();
        const url = await integration.requestToken(accountId, uniqueRef);
        this.logger.log({ message: 'Requested a token url', detail: { url, type, accountId }, fn: this.generateTokenisationUrl.name });
        return url;
    }

    // Fix typing
    @Transactional()
    async saveCreditGuardToken(accountId: number, query: CreditGuardTokenDetails): Promise<Account> {
        this.logger.log({ message: 'Updating account payment token: ', detail: { query, accountId }, fn: this.saveCreditGuardToken.name });
        const account = await Account.findOne(accountId);
        if (isNil(account)) {
            this.logger.error({
                message: `Could not find account with id ${accountId}`,
                detail: { accountId },
                fn: this.saveCreditGuardToken.name,
            });
            return;
        }
        try {
            // Find the pending token
            const token = await CreditGuardToken.createQueryBuilder('token')
                .where('token.paymentReference = :uniqueId', { uniqueId: query.uniqueID })
                .getOne();
            if (isNil(token)) {
                this.logger.error({
                    message: `Could not find token with id ${query.uniqueID}`,
                    detail: { query },
                    fn: this.saveCreditGuardToken.name,
                });
                return;
            }

            // Update the token
            token.raw = query;
            token.cardMask = query.cardMask;
            token.active = true;
            await token.save();

            // Link token
            if (query.type === CreditGuardIntegrationType.ATG) {
                account.atgCreditGuard = token;
            } else if (query.type === CreditGuardIntegrationType.RP) {
                account.rpCreditGuard = token;
            } else {
                throw new BadRequestException({ message: ERROR_CODES.E100_UnsupportedProvider.message() });
            }

            await account.save();
            await Log.createAndSave({
                account,
                type: LogType.Updated,
                message: 'Account payment method updated',
                priority: LogPriority.High,
            });
        } catch (e) {
            this.logger.error({
                message: 'Error on update account payment token',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.saveCreditGuardToken.name,
            });
        }
        return account;
    }
}
