import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Role } from '@entities';
import { remove } from 'lodash';

@Injectable()
export class GetRolesService {
    constructor(private logger: Logger) {}

    async getRoles(): Promise<Role[]> {
        this.logger.log({ message: `Getting Roles`, detail: null, fn: this.getRoles.name });
        const roles = await Role.find();
        remove(roles, { name: 'System Administrator' });
        this.logger.log({ message: `Found Roles, length: `, detail: roles.length, fn: this.getRoles.name });
        return roles;
    }
}
