import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '@modules/user/controllers/user.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { Log, LogPriority, LogType, User } from '@entities';

@Injectable()
export class UpdateUserService {
    constructor(private logger: Logger) {}

    async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
        this.logger.log({ message: 'Updating user: ', detail: merge({ id }, dto), fn: this.updateUser.name });
        let user = await User.findOne(id);
        user = merge(user, dto);
        await user.save();
        this.logger.log({ message: 'Updated user: ', detail: id, fn: this.updateUser.name });
        await Log.createAndSave({ user, type: LogType.Updated, message: 'Updated user successfully', priority: LogPriority.High });
        return user;
    }
}
