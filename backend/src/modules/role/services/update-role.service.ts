import { Injectable } from '@nestjs/common';
import { UpdateRoleDto } from '@modules/role/controllers/role.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { Role } from '@entities';

@Injectable()
export class UpdateRoleService {
    constructor(private logger: Logger) {}

    async updateRole(id: number, dto: UpdateRoleDto): Promise<Role> {
        this.logger.log({ message: 'Updating Role: ', detail: merge({ id }, dto), fn: this.updateRole.name });
        let role = await Role.findOne(id);
        role = merge(role, dto);
        await role.save();
        this.logger.log({ message: 'Updated Role: ', detail: id, fn: this.updateRole.name });
        return role;
    }
}
