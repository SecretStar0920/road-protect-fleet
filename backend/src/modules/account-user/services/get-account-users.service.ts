import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountUser } from '@entities';

@Injectable()
export class GetAccountUsersService {
    constructor(private logger: Logger) {}

    async getAccountUsers(): Promise<AccountUser[]> {
        this.logger.log({ message: `Getting Account Users`, detail: null, fn: this.getAccountUsers.name });

        const accountUsers = await AccountUser.findWithMinimalRelations().getMany();

        this.logger.log({ message: `Found Account Users, length: `, detail: accountUsers.length, fn: this.getAccountUsers.name });
        return accountUsers;
    }
}
