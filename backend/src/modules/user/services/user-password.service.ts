import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Log, LogPriority, LogType, User } from '@entities';

@Injectable()
export class UserPasswordService {
    constructor(private logger: Logger) {}

    async resetUserLoginAttempts(userId: number): Promise<User> {
        const user = await User.findOne(userId);
        user.loginAttempts = 0;
        await user.save();
        this.logger.log({ message: 'Reset user login attempts. ', detail: userId, fn: this.resetUserLoginAttempts.name });
        await Log.createAndSave({ user, type: LogType.Updated, message: 'Reset user login attempts.', priority: LogPriority.High });
        return user;
    }
}
