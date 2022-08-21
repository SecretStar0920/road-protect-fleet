import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Account, UserType } from '@entities';
import { isNil } from 'lodash';
import { Reflector } from '@nestjs/core';
import { Logger } from '@logger';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
/**
 * This guard is used in the account module to restrict cross account actions unless certain criteria are met
 */
export class AccountActionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private logger: Logger) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request & { identity: IdentityDto } = context.switchToHttp().getRequest();
        const identity = request.identity;

        // Must be logged in
        if (!identity || !identity.user || !identity.accountUserId || !identity.accountId) {
            throw new ForbiddenException(ERROR_CODES.E068_MissingLoginDetails.message());
        }

        // If system admin allow
        const user = identity.user;
        const isSystemAdmin = user.type === UserType.Developer || user.type === UserType.Admin;
        if (isSystemAdmin) {
            return true;
        }

        // Check is same account
        const accountId = request.params.accountId;
        if (isNil(accountId)) {
            // No target accountId detected
            return true;
        }

        if (+accountId === +identity.accountId) {
            return true;
        }

        this.logger.warn({
            message: 'Account user performing an action on another account',
            detail: { accountId, identity },
            fn: AccountActionGuard.name,
        });

        // Find target account
        const account = await Account.findWithMinimalRelations().andWhere('account.accountId = :accountId', { accountId }).getOne();
        if (isNil(account)) {
            throw new BadRequestException({ message: ERROR_CODES.E026_CouldNotFindAccount.message({ accountId }) });
        }

        if (account.managed) {
            throw new ForbiddenException({
                message: ERROR_CODES.E067_NotPermittedToTakeActionOnAccount.message(),
            });
        }

        return true;
    }
}
