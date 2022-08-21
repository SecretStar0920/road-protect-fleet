import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { User } from '@entities';

@Injectable()
export class GetUsersService {
    constructor(private logger: Logger) {}

    async getUsers(): Promise<User[]> {
        this.logger.log({ message: `Getting users`, detail: null, fn: this.getUsers.name });
        const users = await User.findWithMinimalRelations().getMany();
        this.logger.log({ message: `Found users, length: `, detail: users.length, fn: this.getUsers.name });
        return users;
    }
}
