import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '@modules/role/controllers/role.controller';
import { Logger } from '@logger';
import { Role } from '@entities';
import { getManager } from 'typeorm';

@Injectable()
export class CreateRoleService {
    constructor(private logger: Logger) {}

    async create(dto: CreateRoleDto): Promise<Role> {
        this.logger.debug({ message: 'Creating Role', detail: dto, fn: this.create.name });

        const role = await getManager().transaction(async (transaction) => {
            const createdRole = await Role.create(dto);
            return transaction.save(createdRole);
        });

        this.logger.debug({ message: 'Created Role', detail: role, fn: this.create.name });
        return role;
    }
}
