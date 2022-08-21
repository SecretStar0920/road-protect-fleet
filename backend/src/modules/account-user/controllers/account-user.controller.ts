import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetAccountUsersService } from '@modules/account-user/services/get-account-users.service';
import { UpdateAccountUserService } from '@modules/account-user/services/update-account-user.service';
import { AccountUser } from '@entities';
import { DeleteAccountUserService } from '@modules/account-user/services/delete-account-user.service';
import { GetAccountUserService } from '@modules/account-user/services/get-account-user.service';
import { CreateAccountUserService } from '@modules/account-user/services/create-account-user.service';
import { GetAccountUsersForAccountService } from '@modules/account-user/services/get-account-users-for-account.service';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { isNil } from 'lodash';
import { CreateAccountUserDto } from '@modules/account-user/controllers/create-account-user.dto';
import { ArrayNotEmpty, IsOptional } from 'class-validator';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class UpdateAccountUserDto {
    @IsOptional()
    @ApiProperty({ description: 'The new role/roles of the account user' })
    @ArrayNotEmpty()
    roleNames?: string[];
    @IsOptional()
    @ApiProperty()
    name?: string;
    @IsOptional()
    @ApiProperty()
    email?: string;
}

@Controller('account-user')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class AccountUserController {
    constructor(
        private getAccountUserService: GetAccountUserService,
        private getAccountUsersService: GetAccountUsersService,
        private getAccountUsersForAccountService: GetAccountUsersForAccountService,
        private createAccountUserService: CreateAccountUserService,
        private updateAccountUserService: UpdateAccountUserService,
        private deleteAccountUserService: DeleteAccountUserService,
    ) {}

    @Get('me')
    async getCurrentAccountUser(@Param('accountUserId') accountUserId: number, @Identity() identity: IdentityDto): Promise<AccountUser> {
        if (isNil(identity.accountUserId)) {
            throw new ForbiddenException(ERROR_CODES.E057_MissingIdentityReLogin.message());
        }

        return this.getAccountUserService.getCurrentAccountUser(identity.accountUserId);
    }

    @Get(':accountUserId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewUser)
    async getAccountUser(@Param('accountUserId') accountUserId: number): Promise<AccountUser> {
        return this.getAccountUserService.getCurrentAccountUser(accountUserId);
    }

    @Get()
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewUsers)
    async getAccountUsers(): Promise<AccountUser[]> {
        return this.getAccountUsersService.getAccountUsers();
    }

    @Get('account/:accountId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewUsers)
    async getAccountUsersForAccount(@Param('accountId') accountId: number): Promise<AccountUser[]> {
        return this.getAccountUsersForAccountService.getAccountUsersForAccount(accountId);
    }

    @Post()
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.CreateUsers)
    async createAccountUser(@Body() dto: CreateAccountUserDto): Promise<AccountUser> {
        return this.createAccountUserService.createAccountUserAndCreateUserIfNotFound(dto);
    }

    @Post(':accountUserId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditUsers)
    async updateAccountUser(@Param('accountUserId') accountUserId: number, @Body() dto: UpdateAccountUserDto): Promise<AccountUser> {
        return await this.updateAccountUserService.updateAccountUser(accountUserId, dto);
    }

    @Delete(':accountUserId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.DeleteUsers)
    async deleteAccountUser(@Param('accountUserId') accountUserId: number): Promise<AccountUser> {
        return this.deleteAccountUserService.deleteAccountUser(accountUserId);
    }
}
