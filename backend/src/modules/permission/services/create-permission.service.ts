import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from '@modules/permission/controllers/permission.controller';
import { Logger } from '@logger';
import { Permission } from '@entities';
import { getManager } from 'typeorm';

@Injectable()
export class CreatePermissionService {
    constructor(private logger: Logger) {}

    async create(dto: CreatePermissionDto): Promise<Permission> {
        this.logger.debug({ message: 'Creating Permission', detail: dto, fn: this.create.name });
        const permission = await getManager().transaction(async (transaction) => {
            const created = await this.createOnly(dto);
            const saved = await transaction.save(created);
            return saved;
        });
        this.logger.debug({ message: 'Saved Permission', detail: permission, fn: this.create.name });
        return permission;
    }

    async createOnly(dto: CreatePermissionDto): Promise<Permission> {
        return Permission.create(dto);
    }
}
