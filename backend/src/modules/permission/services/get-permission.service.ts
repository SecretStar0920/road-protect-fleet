import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Permission } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetPermissionService {
    constructor(private logger: Logger) {}

    async getPermission(permissionId: number): Promise<Permission> {
        this.logger.log({ message: `Getting Permission with id: `, detail: permissionId, fn: this.getPermission.name });
        const permission = await Permission.createQueryBuilder('permission')
            .andWhere('permission.permissionId = :id', { id: permissionId })
            .getOne();
        if (!permission) {
            throw new BadRequestException({ message: ERROR_CODES.E139_CouldNotFindPermission.message({ permissionId }) });
        }
        this.logger.log({ message: `Found Permission with id: `, detail: permission.permissionId, fn: this.getPermission.name });
        return permission;
    }
}
