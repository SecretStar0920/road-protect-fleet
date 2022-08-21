import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Permission } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeletePermissionService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async delete(id: number): Promise<Permission> {
        this.logger.log({ message: 'Deleting Permission:', detail: id, fn: this.delete.name });
        const permission = await Permission.findOne(id);
        this.logger.log({ message: 'Found Permission:', detail: id, fn: this.delete.name });
        if (!permission) {
            this.logger.warn({ message: 'Could not find Permission to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E134_CouldNotFindPermissionToDelete.message() });
        }

        await Permission.remove(permission);
        this.logger.log({ message: 'Deleted Permission:', detail: id, fn: this.delete.name });
        return Permission.create({ permissionId: id });
    }

    async softDelete(id: number): Promise<Permission> {
        this.logger.log({ message: 'Soft Deleting Permission:', detail: id, fn: this.delete.name });
        const permission = await Permission.findOne(id);
        this.logger.log({ message: 'Found Permission:', detail: id, fn: this.delete.name });
        if (!permission) {
            this.logger.warn({ message: 'Could not find Permission to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E134_CouldNotFindPermissionToDelete.message() });
        }

        // permission.active = false; // FIXME
        await permission.save();
        this.logger.log({ message: 'Soft Deleted Permission:', detail: id, fn: this.delete.name });
        return permission;
    }
}
