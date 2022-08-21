import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { CreateRoleService } from './services/create-role.service';
import { UpdateRoleService } from './services/update-role.service';
import { GetRoleService } from './services/get-role.service';
import { GetRolesService } from './services/get-roles.service';
import { DeleteRoleService } from './services/delete-role.service';

@Module({
    controllers: [RoleController],
    providers: [CreateRoleService, UpdateRoleService, GetRoleService, GetRolesService, DeleteRoleService],
    imports: [],
})
export class RoleModule {}
