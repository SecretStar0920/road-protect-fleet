import { Body, Controller, Delete, ForbiddenException, Get, NotImplementedException, Param, Post, UseGuards } from '@nestjs/common';
import { GetRoleService } from '@modules/role/services/get-role.service';
import { GetRolesService } from '@modules/role/services/get-roles.service';
import { CreateRoleService } from '@modules/role/services/create-role.service';
import { UpdateRoleService } from '@modules/role/services/update-role.service';
import { DeleteRoleService } from '@modules/role/services/delete-role.service';
import { Role, RolePermission } from '@entities';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class UpdateRoleDto {
    // Insert Properties
}

export class CreateRoleDto {
    // Insert Properties
}

@Controller('role')
@UseGuards(UserAuthGuard)
export class RoleController {
    constructor(
        private getRoleService: GetRoleService,
        private getRolesService: GetRolesService,
        private createRoleService: CreateRoleService,
        private updateRoleService: UpdateRoleService,
        private deleteRoleService: DeleteRoleService,
    ) {}

    @Get('me')
    async getCurrentRole(@Identity() identity: IdentityDto): Promise<Role> {
        const accountUserId = identity.accountUserId;
        if (!accountUserId) {
            throw new ForbiddenException(ERROR_CODES.E057_MissingIdentityReLogin.message());
        }
        return this.getRoleService.getCurrentRole(accountUserId);
    }

    @Get('my-permissions')
    async getMyPermisssions(@Identity() identity: IdentityDto): Promise<RolePermission[]> {
        const accountUserId = identity.accountUserId;
        if (!accountUserId) {
            throw new ForbiddenException(ERROR_CODES.E057_MissingIdentityReLogin.message());
        }
        return this.getRoleService.getMyPermissions(accountUserId);
    }

    @Get(':roleId')
    async getRole(@Param('roleId') roleId: number): Promise<Role> {
        return this.getRoleService.getRole(roleId);
    }

    @Get()
    async getRoles(): Promise<Role[]> {
        return this.getRolesService.getRoles();
    }

    @Post()
    @UseGuards(SystemAdminGuard)
    async createRole(@Body() dto: CreateRoleDto): Promise<Role> {
        // return await this.createRoleService.create(dto);
        throw new NotImplementedException(ERROR_CODES.E072_RoleCreationNotImplementedYet.message());
    }

    @Post(':roleId')
    @UseGuards(SystemAdminGuard)
    async updateRole(@Param('roleId') roleId: number, @Body() dto: UpdateRoleDto): Promise<Role> {
        return this.updateRoleService.updateRole(roleId, dto);
    }

    @Delete(':roleId')
    @UseGuards(SystemAdminGuard)
    async deleteRole(@Param('roleId') roleId): Promise<Role> {
        return this.deleteRoleService.deleteRole(roleId);
    }

    @Delete(':roleId/soft')
    @UseGuards(SystemAdminGuard)
    async softDeleteRole(@Param('roleId') roleId): Promise<Role> {
        return this.deleteRoleService.softDeleteRole(roleId);
    }
}
