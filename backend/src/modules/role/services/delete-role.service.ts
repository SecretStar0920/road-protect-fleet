import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Role } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteRoleService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteRole(id: number): Promise<Role> {
        this.logger.log({ message: 'Deleting Role:', detail: id, fn: this.deleteRole.name });
        const role = await Role.findOne(id);
        this.logger.log({ message: 'Found Role:', detail: id, fn: this.deleteRole.name });
        if (!role) {
            this.logger.warn({ message: 'Could not find Role to delete', detail: id, fn: this.deleteRole.name });
            throw new BadRequestException({ message: ERROR_CODES.E148_CouldNotFindRoleToDelete.message() });
        }

        await Role.remove(role);
        this.logger.log({ message: 'Deleted Role:', detail: id, fn: this.deleteRole.name });
        return Role.create({ roleId: id });
    }

    async softDeleteRole(id: number): Promise<Role> {
        this.logger.log({ message: 'Soft Deleting Role:', detail: id, fn: this.deleteRole.name });
        const role = await Role.findOne(id);
        this.logger.log({ message: 'Found Role:', detail: id, fn: this.deleteRole.name });
        if (!role) {
            this.logger.warn({ message: 'Could not find Role to delete', detail: id, fn: this.deleteRole.name });
            throw new BadRequestException({ message: ERROR_CODES.E148_CouldNotFindRoleToDelete.message() });
        }

        // role.active = false;
        await role.save();
        this.logger.log({ message: 'Soft Deleted Role:', detail: id, fn: this.deleteRole.name });
        return role;
    }
}
