import { Module } from '@nestjs/common';
import { PermissionController } from './controllers/permission.controller';
import { CreatePermissionService } from './services/create-permission.service';
import { UpdatePermissionService } from './services/update-permission.service';
import { GetPermissionService } from './services/get-permission.service';
import { GetPermissionsService } from './services/get-permissions.service';
import { DeletePermissionService } from './services/delete-permission.service';

@Module({
    controllers: [PermissionController],
    providers: [CreatePermissionService, UpdatePermissionService, GetPermissionService, GetPermissionsService, DeletePermissionService],
    imports: [],
})
export class PermissionModule {}
