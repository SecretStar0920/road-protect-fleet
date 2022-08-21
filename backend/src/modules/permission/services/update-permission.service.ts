import { Injectable } from '@nestjs/common';
import { UpdatePermissionDto } from '@modules/permission/controllers/permission.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { Permission } from '@entities';

@Injectable()
export class UpdatePermissionService {
    constructor(private logger: Logger) {}

    async updatePermission(id: number, dto: UpdatePermissionDto): Promise<Permission> {
        this.logger.log({ message: 'Updating Permission: ', detail: merge({ id }, dto), fn: this.updatePermission.name });
        let permission = await Permission.findOne(id);
        permission = merge(permission, dto);
        await permission.save();
        this.logger.log({ message: 'Updated Permission: ', detail: id, fn: this.updatePermission.name });
        return permission;
    }
}
