import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ForgotPasswordRequestDto } from '@modules/auth/controllers/forgot-password-request.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@modules/shared/entities/user.entity';
import { Logger } from '@logger';
import { isNil, omit } from 'lodash';
import * as moment from 'moment';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { ForgotPasswordEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { Config } from '@config/config';
import { ForgotPasswordConfirmDto } from '../controllers/forgot-password-confirm.dto';
import { PasswordService } from '@modules/auth/services/password.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

class ForgotPasswordJwtPayload {
    userId: number;
    email: string;
    timestamp: number;
}

@Injectable()
export class ForgotPasswordService {
    constructor(
        private jwtService: JwtService,
        private logger: Logger,
        private emailService: EmailService,
        private passwordService: PasswordService,
    ) {}

    async forgotPasswordRequest(dto: ForgotPasswordRequestDto) {
        this.logger.debug({ message: 'Requesting a password reset', detail: dto, fn: this.forgotPasswordRequest.name });
        // Find user
        const user = await User.findByEmail(dto.email).getOne();
        if (isNil(user)) {
            this.logger.error({ message: 'Password reset request for non-existent email', fn: this.forgotPasswordRequest.name });
            // Sometimes we don't tell the user, but for now to reduce confusion we will let them know
            throw new BadRequestException({
                message: ERROR_CODES.E062_CannotSendResetPasswordEmailNotInSystem.message(),
            });
        }
        // Generate JWT
        const jwtPayload: ForgotPasswordJwtPayload = {
            userId: user.userId,
            email: user.email,
            timestamp: moment().unix(),
        };
        const jwt = await this.jwtService.signAsync(jwtPayload, { expiresIn: '2d' });
        // Send forgot password email with JWT Link
        this.logger.debug({ message: 'Sending email for the password reset', detail: null, fn: this.forgotPasswordRequest.name });
        try {
            const context: ForgotPasswordEmail = {
                email: user.email,
                name: user.name,
                jwt,
                link: `${Config.get.app.url}/forgot-password/confirm/${jwt}`,
            };
            await this.emailService.sendEmail({
                template: EmailTemplate.ForgotPassword,
                to: user.email,
                subject: 'Reset Password',
                context: context,
            });
        } catch (e) {
            this.logger.error({
                message: 'Failed to send password reset e-mail',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.forgotPasswordRequest.name,
            });
            throw new InternalServerErrorException({ message: ERROR_CODES.E063_FailedToSendResetPasswordEmail.message(), error: e });
        }
    }

    async forgotPasswordConfirm(dto: ForgotPasswordConfirmDto) {
        this.logger.debug({ message: 'Confirming a password reset', detail: null, fn: this.forgotPasswordConfirm.name });

        let verifiedJwt: ForgotPasswordJwtPayload;
        try {
            // Verify jwt
            verifiedJwt = await this.jwtService.verifyAsync<ForgotPasswordJwtPayload>(dto.jwt);
        } catch (e) {
            this.logger.error({
                message: 'JWT Verification failed on password reset',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.forgotPasswordConfirm.name,
            });
            throw new ForbiddenException({ message: ERROR_CODES.E061_FailedToResetPasswordExpiredToken.message() });
        }
        // Find user
        const user = await User.findByEmail(verifiedJwt.email).getOne();
        if (isNil(user)) {
            this.logger.error({ message: 'User not found in db from JWT', detail: verifiedJwt, fn: this.forgotPasswordConfirm.name });
            throw new BadRequestException({ message: ERROR_CODES.E060_UserNotFound.message({ email: verifiedJwt.email }) });
        }
        // Update password
        const password = await this.passwordService.generateBcryptHash(dto.newPassword);
        user.password = password;

        this.logger.debug({ message: 'Successfully reset password', detail: null, fn: this.forgotPasswordConfirm.name });
        // Save user
        return omit(await user.save(), 'password');
    }
}
