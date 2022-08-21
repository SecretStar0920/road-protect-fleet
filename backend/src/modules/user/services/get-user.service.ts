import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { User } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetUserService {
    constructor(private logger: Logger) {}

    async getUser(userId: number): Promise<User> {
        this.logger.log({ message: `Getting user with id: `, detail: userId, fn: this.getUser.name });
        const user = await User.findWithMinimalRelations().andWhere('user.userId = :userId', { userId }).getOne();
        if (!user) {
            throw new BadRequestException({ message: ERROR_CODES.E060_UserNotFound.message({ userId }) });
        }
        this.logger.log({ message: `Found user with id: `, detail: user.userId, fn: this.getUser.name });
        return user;
    }
}
