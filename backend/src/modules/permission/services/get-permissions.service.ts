import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Permission } from '@entities';

@Injectable()
export class GetPermissionsService {
    constructor(private logger: Logger) {}

    async getPermissions(): Promise<Permission[]> {
        this.logger.log({ message: `Getting Permissions`, detail: null, fn: this.getPermissions.name });
        const permissions = await Permission.createQueryBuilder('permission').getMany();
        this.logger.log({ message: `Found Permissions, length: `, detail: permissions.length, fn: this.getPermissions.name });
        return permissions;
    }
}
