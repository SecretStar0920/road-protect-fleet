import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { CreateUserService } from './services/create-user.service';
import { UpdateUserService } from './services/update-user.service';
import { GetUserService } from './services/get-user.service';
import { GetUsersService } from './services/get-users.service';
import { DeleteUserService } from './services/delete-user.service';
import { UserQueryController } from '@modules/user/controllers/user-query.controller';
import { UserPresetController } from '@modules/user/controllers/user-preset.controller';
import { UserPresetService } from '@modules/user/services/user-preset.service';
import { UserPasswordService } from '@modules/user/services/user-password.service';

@Module({
    controllers: [UserController, UserQueryController, UserPresetController],
    providers: [
        CreateUserService,
        UpdateUserService,
        GetUserService,
        UserPasswordService,
        GetUsersService,
        DeleteUserService,
        UserPresetService,
    ],
    exports: [CreateUserService],
})
export class UserModule {}
