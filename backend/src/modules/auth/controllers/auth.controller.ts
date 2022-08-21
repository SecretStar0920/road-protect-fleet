import { Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserAuthService } from '@modules/auth/services/user-auth.service';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { LoginResponseDto } from '@modules/auth/controllers/login-response.dto';
import { LoginDto } from '@modules/auth/controllers/login.dto';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { ChangeAccountResponseDto } from '@modules/auth/controllers/change-account-response.dto';
import { User } from '@entities';
import { isNil } from 'lodash';
import { ChangePasswordDto } from '@modules/auth/controllers/change-password.dto';
import { ForgotPasswordRequestDto } from '@modules/auth/controllers/forgot-password-request.dto';
import { ForgotPasswordService } from '@modules/auth/services/forgot-password.service';
import { ForgotPasswordConfirmDto } from '@modules/auth/controllers/forgot-password-confirm.dto';
import { IsBoolean, IsDefined, IsNumber } from 'class-validator';
import { GenerateApiUserTokenDto } from '@modules/auth/controllers/generate-api-user-token.dto';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Transform } from 'class-transformer';
import { asInteger } from '@modules/shared/helpers/dto-transforms';
import { FeatureFlagGuard, FeatureFlagMetadata } from '@modules/shared/modules/feature-flag/guards/feature-flag.guard';
import { LoginWithRecaptchaDto } from '@modules/auth/controllers/login-with-recaptcha.dto';
import { RateLimit, SetRateLimit } from '@modules/rate-limit/rate-limit.decorator';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { RateLimitGuard } from '@modules/rate-limit/rate-limit.guard';
import { Config } from '@config/config';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class CompleteSignupDto {
    @IsBoolean()
    @IsDefined()
    isComplete: boolean;
}

export class ChangeAccountDto {
    @IsNumber()
    @Transform((val) => asInteger(val))
    accountId: number;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: UserAuthService, private forgotPasswordService: ForgotPasswordService) {}

    @Post('login')
    @ApiExcludeEndpoint()
    @UseGuards(FeatureFlagGuard, RateLimitGuard)
    @FeatureFlagMetadata({ title: 'login-with-recaptcha', defaultEnabled: true })
    async loginWithRecaptcha(@Body() dto: LoginWithRecaptchaDto, @Identity() identity: IdentityDto): Promise<LoginResponseDto> {
        return this.authService.login(dto, identity);
    }

    @Post('login/developer')
    @ApiExcludeEndpoint()
    @UseGuards(FeatureFlagGuard)
    @FeatureFlagMetadata({ title: 'login-with-recaptcha', defaultEnabled: true })
    async loginAsDeveloper(@Body() dto: LoginDto, @Identity() identity: IdentityDto): Promise<LoginResponseDto> {
        return this.authService.login(dto, identity, false);
    }

    @Post('generate-api-user-token')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async generateApiUserToken(@Body() dto: GenerateApiUserTokenDto) {
        return this.authService.generateApiUserToken(dto);
    }

    @Post('change-account/:accountId')
    @UseGuards(UserAuthGuard)
    @ApiExcludeEndpoint()
    async changeAccount(@Param() dto: ChangeAccountDto, @Identity() identity: IdentityDto): Promise<ChangeAccountResponseDto> {
        return this.authService.changeUserAccount(dto.accountId, identity);
    }

    @Get('me')
    @UseGuards(UserAuthGuard)
    @ApiExcludeEndpoint()
    async me(@Identity() identity: IdentityDto): Promise<User> {
        if (isNil(identity.user)) {
            throw new ForbiddenException(ERROR_CODES.E057_MissingIdentityReLogin.message());
        }
        return this.authService.getMe(identity.user);
    }

    @Post('change-password')
    @UseGuards(UserAuthGuard)
    @ApiExcludeEndpoint()
    async changePassword(@Body() dto: ChangePasswordDto, @Identity() identity: IdentityDto) {
        return this.authService.changePassword(dto, identity);
    }

    @Post('forgot-password/request')
    @ApiExcludeEndpoint()
    async forgotPasswordRequest(@Body() dto: ForgotPasswordRequestDto) {
        return this.forgotPasswordService.forgotPasswordRequest(dto);
    }

    @Post('forgot-password/confirm')
    @ApiExcludeEndpoint()
    async forgotPasswordConfirm(@Body() dto: ForgotPasswordConfirmDto) {
        return this.forgotPasswordService.forgotPasswordConfirm(dto);
    }

    @Post('complete-signup')
    @UseGuards(UserAuthGuard)
    @ApiExcludeEndpoint()
    @ApiBearerAuth()
    async completeSignup(@Body() dto: CompleteSignupDto, @Identity() identity: IdentityDto) {
        return this.authService.completeSignup(dto, identity);
    }
}
