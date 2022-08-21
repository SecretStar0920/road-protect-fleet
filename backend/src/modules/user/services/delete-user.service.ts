import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { User } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteUserService {
    constructor(private logger: Logger) {}

    async deleteUser(id: number): Promise<User> {
        this.logger.log({ message: 'Deleting user:', detail: id, fn: this.deleteUser.name });
        const user = await User.findOne(id);
        this.logger.log({ message: 'Found user:', detail: id, fn: this.deleteUser.name });
        if (!user) {
            this.logger.warn({ message: 'Could not find user to delete', detail: id, fn: this.deleteUser.name });
            throw new BadRequestException({ message: ERROR_CODES.E156_CouldNotFindUserToDelete.message() });
        }

        await User.getRepository().delete(id);
        this.logger.log({ message: 'Deleted user:', detail: id, fn: this.deleteUser.name });
        return user;
    }
}
