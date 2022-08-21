import { Controller, Delete, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { GetUserService } from '@modules/user/services/get-user.service';
import { GetUsersService } from '@modules/user/services/get-users.service';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { UpdateUserService } from '@modules/user/services/update-user.service';
import { DeleteUserService } from '@modules/user/services/delete-user.service';
import { User, UserType } from '@entities';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { Transform } from 'class-transformer';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Logger } from '@logger';
import { RateLimit, SetRateLimit } from '@modules/rate-limit/rate-limit.decorator';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { Config } from '@config/config';
import { UserPasswordService } from '@modules/user/services/user-password.service';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsOptional()
    surname?: string;
    @IsString()
    @IsOptional()
    type?: UserType;
    @IsOptional()
    @IsString()
    cellphoneNumber?: string;
}

export class CreateUserDto {
    @IsString({
        message: 'Name must be a text value',
    })
    name: string;
    @IsString({
        message: 'Surname must be a text value',
    })
    surname: string;
    @IsString()
    @IsOptional()
    password?: string;
    @Transform((val) => val.toLowerCase())
    @IsEmail()
    email: string;
    @IsString()
    type: UserType;
    @IsOptional()
    @IsString()
    cellphoneNumber?: string;
}

@Controller('user')
@UseGuards(UserAuthGuard)
export class UserController {
    constructor(
        private getUserService: GetUserService,
        private getUsersService: GetUsersService,
        private createUserService: CreateUserService,
        private updateUserService: UpdateUserService,
        private deleteUserService: DeleteUserService,
        private userPasswordService: UserPasswordService,
        private logger: Logger,
    ) {}

    @Get(':userId')
    async getUser(@Param('userId') userId: number): Promise<User> {
        return this.getUserService.getUser(userId);
    }

    @Get()
    @UseGuards(SystemAdminGuard)
    async getUsers(): Promise<User[]> {
        return this.getUsersService.getUsers();
    }

    @Post()
    @UseGuards(SystemAdminGuard)
    @SetRateLimit(RateLimitActions.createUser, Config.get.rateLimit.actions.createUser, `You can only create {{limit}} users per day.`)
    @RateLimit()
    async createUser(@Body() dto: CreateUserDto, @Identity() identity: IdentityDto): Promise<User> {
        this.assertPermissions(dto, identity);
        return this.createUserService.createUser(dto);
    }

    @Post(':userId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditUsers) // Not sure about this permission
    async updateUser(@Param('userId') userId: number, @Body() dto: UpdateUserDto, @Identity() identity: IdentityDto): Promise<User> {
        this.assertPermissions(dto, identity);
        return this.updateUserService.updateUser(userId, dto);
    }

    @Delete(':userId')
    @UseGuards(SystemAdminGuard)
    async deleteUser(@Param('userId') userId): Promise<User> {
        return this.deleteUserService.deleteUser(userId);
    }

    /**
     * Check that the user that is creating or updating the user has the
     * permissions to set a user to an admin or developer. If not, we log it
     * and then throw an exception.
     * @param dto The create or update dto
     * @param identity The identity of the user running this action
     * @private
     */
    private assertPermissions(dto: UpdateUserDto | CreateUserDto, identity: IdentityDto) {
        if (identity.user.type !== UserType.Admin && identity.user.type !== UserType.Developer) {
            if (dto.type === UserType.Admin || dto.type === UserType.Developer) {
                this.logger.error({
                    fn: this.updateUser.name,
                    message: `User with email ${identity.user.email} is trying to convert user a user to an ADMIN`,
                    detail: {
                        dto,
                        identity,
                    },
                });
                throw new UnauthorizedException();
            }
            delete dto.type;
        }
    }

    @UseGuards(SystemAdminGuard)
    @Get('reset-login-attempts/:userId')
    async resetUserLoginAttempts(@Param('userId') userId: number): Promise<User> {
        return this.userPasswordService.resetUserLoginAttempts(userId);
    }
}
