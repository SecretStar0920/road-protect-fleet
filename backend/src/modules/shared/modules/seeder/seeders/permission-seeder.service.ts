import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Permission } from '@entities';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';

@Injectable()
export class PermissionSeederService extends BaseSeederService<Permission> {
    protected seederName: string = 'Permission';

    constructor() {
        super();
    }

    async setSeedData() {
        this.seedData = Object.values(PERMISSIONS);
    }

    async seedItemFunction(item: Partial<Permission>) {
        return Permission.create(item).save();
    }
}
