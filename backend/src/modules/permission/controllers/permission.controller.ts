import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetPermissionService } from '@modules/permission/services/get-permission.service';
import { GetPermissionsService } from '@modules/permission/services/get-permissions.service';
import { CreatePermissionService } from '@modules/permission/services/create-permission.service';
import { UpdatePermissionService } from '@modules/permission/services/update-permission.service';
import { DeletePermissionService } from '@modules/permission/services/delete-permission.service';
import { Permission } from '@entities';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

export class UpdatePermissionDto {
    // Insert Properties
}

export class CreatePermissionDto {
    // Insert Properties
}

@Controller('permission')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class PermissionController {
    constructor(
        private getPermissionService: GetPermissionService,
        private getPermissionsService: GetPermissionsService,
        private createPermissionService: CreatePermissionService,
        private updatePermissionService: UpdatePermissionService,
        private deletePermissionService: DeletePermissionService,
    ) {}

    @Get(':permissionId')
    async getPermission(@Param('permissionId') permissionId: number): Promise<Permission> {
        return await this.getPermissionService.getPermission(permissionId);
    }

    @Get()
    @ApiExcludeEndpoint()
    async getPermissions(): Promise<Permission[]> {
        return await this.getPermissionsService.getPermissions();
    }

    // @Post()
    // @ApiExcludeEndpoint()
    // async createPermission(@Body() dto: CreatePermissionDto): Promise<Permission> {
    //     return await this.createPermissionService.create(dto);
    // }

    @Post(':permissionId')
    @ApiExcludeEndpoint()
    async updatePermission(@Param('permissionId') permissionId: number, @Body() dto: UpdatePermissionDto): Promise<Permission> {
        return await this.updatePermissionService.updatePermission(permissionId, dto);
    }

    // @Delete(':permissionId')
    // @ApiExcludeEndpoint()
    // async deletePermission(@Param('permissionId') permissionId): Promise<Permission> {
    //     return await this.deletePermissionService.delete(permissionId);
    // }
    //
    // @Delete(':permissionId/soft')
    // async softDeletePermission(@Param('permissionId') permissionId): Promise<Permission> {
    //     return await this.deletePermissionService.softDelete(permissionId);
    // }
}
