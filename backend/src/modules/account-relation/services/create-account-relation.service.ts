import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountRelationDto } from '@modules/account-relation/controllers/account-relation.controller';
import { Logger } from '@logger';
import { Account, ACCOUNT_RELATION_CONSTRAINTS, AccountRelation } from '@entities';
import { isNil } from 'lodash';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class CreateAccountRelationService {
    constructor(private logger: Logger) {}

    @Transactional()
    async createAccountRelation(dto: CreateAccountRelationDto): Promise<AccountRelation> {
        this.logger.debug({ message: 'Creating Account Relation', detail: dto, fn: this.createAccountRelation.name });
        let accountRelation: AccountRelation;
        try {
            const created = await this.createOnly(dto);
            accountRelation = await AccountRelation.save(created);
        } catch (e) {
            databaseExceptionHelper(e, ACCOUNT_RELATION_CONSTRAINTS, 'Failed to create account relation, please contact the developers.');
        }
        this.logger.debug({
            message: 'Saved Account Relation',
            detail: accountRelation.accountRelationId,
            fn: this.createAccountRelation.name,
        });
        return accountRelation;
    }

    @Transactional()
    async createOnly(dto: CreateAccountRelationDto): Promise<AccountRelation> {
        if (dto.forwardAccountId === dto.reverseAccountId) {
            throw new BadRequestException({
                message: ERROR_CODES.E024_CannotCreateRelationBetweenSameAccount.message(),
                context: { accountId: dto.reverseAccountId },
            });
        }
        // Check if Account Relation already exists or not
        const accountRelationTest = await AccountRelation.createQueryBuilder('accountRelation')
            .andWhere('"accountRelation"."forwardAccountId" = :forwardId', { forwardId: dto.forwardAccountId })
            .andWhere('"accountRelation"."reverseAccountId" = :reverseId', { reverseId: dto.reverseAccountId })
            .getOne();

        if (!isNil(accountRelationTest)) {
            this.logger.log({
                message: 'Account Relation already exists',
                detail: accountRelationTest,
                fn: this.createAccountRelation.name,
            });
            return accountRelationTest;
        }

        const forward = await Account.createQueryBuilder('account')
            .where('account.accountId = :accountId', { accountId: dto.forwardAccountId })
            .addSelect(['account.accountId', 'account.identifier'])
            .getOne();

        const reverse = await Account.createQueryBuilder('account')
            .where('account.accountId = :accountId', { accountId: dto.reverseAccountId })
            .addSelect(['account.accountId', 'account.identifier'])
            .getOne();

        if (isNil(forward)) {
            throw new BadRequestException({
                message: ERROR_CODES.E019_ForwardAccountNotFound.message(),
                context: { accountId: dto.forwardAccountId },
            });
        }

        if (isNil(reverse)) {
            throw new BadRequestException({
                message: ERROR_CODES.E023_ReverseAccountNotFound.message(),
                context: { accountId: dto.reverseAccountId },
            });
        }

        return AccountRelation.create({ forward, reverse, data: dto.data });
    }
}
