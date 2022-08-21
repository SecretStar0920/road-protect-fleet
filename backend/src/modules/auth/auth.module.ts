import { NotApiGuard } from '@modules/auth/guards/not-api.guard';
import { Global, HttpModule, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserAuthService } from './services/user-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@config/config';
import { PassportModule } from '@nestjs/passport';
import { UserJwtStrategy } from '@modules/auth/guards/user-jwt.strategy';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { PermissionGuard } from '@modules/auth/guards/permission.guard';
import { ClientAuthService } from '@modules/auth/services/client-auth.service';
import { ClientJwtStrategy } from '@modules/auth/guards/client-jwt.strategy';
import { PasswordService } from '@modules/auth/services/password.service';
import { ForgotPasswordService } from '@modules/auth/services/forgot-password.service';
import { AclGuard } from '@modules/auth/guards/acl.guard';

@Global()
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: Config.get.security.userJwt.secret,
        }),
        HttpModule,
    ],
    controllers: [AuthController],
    providers: [
        PasswordService,
        UserAuthService,
        ClientAuthService,
        ClientJwtStrategy,
        UserJwtStrategy,
        SystemAdminGuard,
        PermissionGuard,
        ForgotPasswordService,
        AclGuard,
        NotApiGuard,
    ],
    exports: [
        PasswordService,
        UserAuthService,
        ClientAuthService,
        SystemAdminGuard,
        PermissionGuard,
        AclGuard,
        PassportModule,
        NotApiGuard,
        JwtModule,
    ],
})
export class AuthModule {}
