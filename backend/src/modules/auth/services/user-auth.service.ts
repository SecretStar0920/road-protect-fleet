import { BadRequestException, ForbiddenException, HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountUser, User, UserType } from '@entities';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { find, isNil, omit } from 'lodash';
import { LoginResponseDto } from '@modules/auth/controllers/login-response.dto';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { ChangeAccountResponseDto } from '@modules/auth/controllers/change-account-response.dto';
import { Config } from '@config/config';
import { ChangePasswordDto } from '@modules/auth/controllers/change-password.dto';
import { PasswordService } from '@modules/auth/services/password.service';
import { CompleteSignupDto } from '@modules/auth/controllers/auth.controller';
import { GenerateApiUserTokenDto } from '@modules/auth/controllers/generate-api-user-token.dto';
import { LoginWithRecaptchaDto } from '@modules/auth/controllers/login-with-recaptcha.dto';
import { LoginDto } from '@modules/auth/controllers/login.dto';
import { MaximumLoginAttemptsException } from '@modules/auth/exceptions/maximum-login-attempts.exception';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export const jwtKeys = ['userId', 'email'];

export interface UserTokenPayload {
    userId: number;
    email: string;
    accountId: number;
    accountUserId: number;
}

@Injectable()
export class UserAuthService {
    constructor(
        private logger: Logger,
        private readonly jwtService: JwtService,
        private passwordService: PasswordService,
        private http: HttpService,
    ) {}

    async login(dto: LoginWithRecaptchaDto | LoginDto, identity: IdentityDto, checkRecaptcha = true): Promise<LoginResponseDto> {
        let user: User = null;
        try {
            this.logger.log({ message: 'Login request', detail: dto.email, fn: this.login.name });

            // Find the user
            user = await User.findWithMinimalRelations().andWhere('user.email = :email', { email: dto.email }).getOne();

            if (!user) {
                this.logger.debug({ message: 'Bad login request, email not found', detail: dto.email, fn: this.login.name });
                throw new ForbiddenException(ERROR_CODES.E054_IncorrectLoginCredentials.message());
            }

            // Check that the user is not an API user
            if (user.type === UserType.API) {
                throw new ForbiddenException(ERROR_CODES.E055_CannotLogingAsAPIUser.message());
            }

            this.logger.debug({ message: 'Successfully found user by email', detail: dto.email, fn: this.login.name });
            if (checkRecaptcha) {
                await this.assertRecaptchaValid({
                    ...dto,
                    recaptchaKey: (dto as LoginWithRecaptchaDto).recaptchaKey,
                });
            }
            this.logger.debug({ message: 'Comparing passwords', detail: '', fn: this.login.name });
            // Compare the passwords using bcrupt compare
            const password = await user.getPassword();
            const validPassword = await bcrypt.compare(dto.password, password);
            if (!validPassword) {
                this.logger.debug({ message: 'Bad login password', detail: dto.email, fn: this.login.name });
                throw new ForbiddenException(ERROR_CODES.E054_IncorrectLoginCredentials.message());
            }

            // Check which accounts they belong to
            const account = this.checkUserAccounts(user, identity);
            const accountUserId = account ? account.accountUserId : undefined;
            const accountId = account ? account.account.accountId : undefined;
            this.logger.log({ message: 'Successful user login', detail: dto.email, fn: this.login.name });

            // Generate token
            const payload: UserTokenPayload = { userId: user.userId, email: user.email, accountId, accountUserId };
            const token = this.jwtService.sign(payload, { expiresIn: Config.get.security.userJwt.expiry });

            this.assertLoginAttempts(user);

            // Reset login attempts
            user.loginAttempts = 0;
            await user.save();
            // Return their user, token and current account information
            return {
                token,
                user: omit(user, ['accounts']),
                accountUserId,
                accountId,
            };
        } catch (e) {
            // Add failed login attempt
            if (user && !(e instanceof MaximumLoginAttemptsException)) {
                user.loginAttempts = user.loginAttempts + 1;
                await user.save();
            }
            throw e;
        }
    }

    private assertLoginAttempts(user: User) {
        if (user.loginAttempts >= Config.get.security.maxLoginAttempts) {
            this.logger.warn({
                fn: this.assertLoginAttempts.name,
                message: `The user ${user.email} has reached the maximum number of login attempts (${user.loginAttempts})`,
            });
            throw new MaximumLoginAttemptsException(ERROR_CODES.E056_MaxLoginAttempts.message({ loginAttempts: user.loginAttempts }));
        }
    }

    async generateApiUserToken(dto: GenerateApiUserTokenDto) {
        const user = await User.findByEmail(dto.email).andWhere('user.type = :type', { type: UserType.API }).getOne();

        if (isNil(user)) {
            throw new BadRequestException(ERROR_CODES.E010_InvalidAPIUserLogin.message());
        }

        const accountUser = await AccountUser.findWithMinimalRelations().where('user.userId = :userId', { userId: user.userId }).getOne();

        const payload: UserTokenPayload = {
            userId: user.userId,
            email: user.email,
            accountId: accountUser.account.accountId,
            accountUserId: accountUser.accountUserId,
        };
        const token = this.jwtService.sign(payload, { expiresIn: '10 years' });

        return { token: `Bearer ${token}` };
    }

    async changeUserAccount(accountId: number, identity: IdentityDto): Promise<ChangeAccountResponseDto> {
        this.logger.log({
            message: 'Request to change account context',
            detail: { user: identity.user.email, from: identity.accountId, to: accountId },
            fn: this.changeUserAccount.name,
        });

        const user = await User.createQueryBuilder('user').where('user.userId = :userId', { userId: identity.user.userId }).getOne();

        if (isNil(user)) {
            throw new ForbiddenException(ERROR_CODES.E057_MissingIdentityReLogin.message());
        }

        const accountUser = await AccountUser.createQueryBuilder('accountUser')
            .innerJoinAndSelect('accountUser.user', 'user')
            .innerJoinAndSelect('accountUser.account', 'account')
            .andWhere('user.userId = :userId', { userId: user.userId })
            .andWhere('account.accountId = :accountId', { accountId })
            .getOne();

        if (!accountUser) {
            this.logger.warn({
                message: 'Could not find account user',
                detail: { email: user.email, accountId },
                fn: this.changeUserAccount.name,
            });
            throw new BadRequestException({ message: ERROR_CODES.E058_CouldNotChangeAccountNotFound.message() });
        }

        this.logger.log({ message: 'Found account user', detail: user.email, fn: this.changeUserAccount.name });

        const accountUserId = accountUser.accountUserId;

        const payload: UserTokenPayload = { userId: user.userId, email: user.email, accountId, accountUserId };
        const token = this.jwtService.sign(payload, { expiresIn: Config.get.security.userJwt.expiry });

        return {
            accountUserId,
            accountId,
            token,
        };
    }

    private checkUserAccounts(user: User, identity: IdentityDto): AccountUser {
        this.logger.log({ message: 'Checking the users accounts, userId:', detail: user.userId, fn: this.checkUserAccounts.name });
        if (user.accounts.length <= 0) {
            this.logger.error({
                message: 'User has no accounts associated with it and is attempting to login, userId:',
                detail: user.userId,
                fn: this.checkUserAccounts.name,
            });
            // throw new BadRequestException( { message: `Login successful, but no accounts linked to your account. Please contact an Admin` } );
            return undefined;
        }

        if (identity.accountUserId) {
            this.logger.log({
                message: 'Found existing identity account user',
                detail: identity.accountUserId,
                fn: this.checkUserAccounts.name,
            });
            const existingidentityAccount = find(user.accounts, (account) => {
                return account.accountUserId === identity.accountUserId;
            });
            if (existingidentityAccount) {
                return existingidentityAccount;
            }
        }

        return user.accounts[0];
    }

    async validateUser(payload: UserTokenPayload) {
        return User.createQueryBuilder('user')
            .where('user.userId = :userId', { userId: payload.userId })
            .andWhere('user.email = :email', { email: payload.email })
            .getOne();
    }

    async getMe(user: User): Promise<User> {
        this.logger.log({ message: 'Returning updated user information for user; ', detail: user.email, fn: this.getMe.name });
        const updatedUser = await User.findByEmail(user.email).getOne();
        if (!updatedUser) {
            this.logger.error({ message: 'Could not find updated user; ', detail: user.email, fn: this.getMe.name });
            throw new BadRequestException({ message: ERROR_CODES.E059_CouldNotReturnUpdatedInformation.message() });
        }
        this.logger.log({ message: 'Found updated user; ', detail: user.email, fn: this.getMe.name });
        return updatedUser;
    }

    async changePassword(dto: ChangePasswordDto, identity: IdentityDto): Promise<any> {
        let user: User;
        if (dto.email) {
            this.logger.warn({
                message: 'A user is changing another users password',
                detail: { identity: identity.user.email, user: dto.email },
                fn: this.changePassword.name,
            });
            user = await User.findByEmail(dto.email).getOne();
            user.completedSignup = false;
        } else {
            user = await User.findWithMinimalRelations().andWhere('user.email = :email', { email: identity.user.email }).getOne();
        }
        if (isNil(user)) {
            throw new BadRequestException({ message: ERROR_CODES.E057_MissingIdentityReLogin.message() });
        }
        // NOTE: removed to simplify the flow, but can easily be added by uncommenting this code and the "CurrentPassword" in the dto
        // const realPassword = await user.getPassword();
        // const validPassword = await bcrypt.compare(dto.currentPassword, realPassword);
        // if (!validPassword) {
        //     this.logger.debug('Bad current password', user.email, this.changePassword.name);
        //     throw new ForbiddenException({ message: 'Invalid current password provided' });
        // }
        const newPassword = await this.passwordService.generateBcryptHash(dto.newPassword);
        user.password = newPassword;
        await user.save();

        return user;
    }

    async completeSignup(dto: CompleteSignupDto, identity: IdentityDto) {
        this.logger.log({ message: 'Changing user signup status', detail: dto, fn: this.getMe.name });
        const user = await User.findByEmail(identity.user.email).getOne();
        if (!user) {
            throw new BadRequestException({ message: ERROR_CODES.E060_UserNotFound.message() });
        }
        user.completedSignup = dto.isComplete;
        await user.save();
        this.logger.log({ message: 'Successfully changed user signup status', detail: dto, fn: this.getMe.name });
        return {
            message: 'Successfully completed signup',
        };
    }

    async assertRecaptchaValid(dto: LoginWithRecaptchaDto) {
        try {
            this.logger.debug({
                fn: this.assertRecaptchaValid.name,
                message: `Requesting Google Recaptcha for ${dto.email}`,
            });

            const response = await this.http
                .post(`${Config.get.google.recaptcha.url}?secret=${Config.get.google.recaptcha.secretKey}&response=${dto.recaptchaKey}`)
                .toPromise();

            if (!response.data.success) {
                throw new UnauthorizedException();
            }
            this.logger.debug({
                fn: this.assertRecaptchaValid.name,
                message: `Google Recaptcha request successful for ${dto.email}`,
            });
            return true;
        } catch (e) {
            this.logger.warn({
                fn: this.assertRecaptchaValid.name,
                message: `Google Recaptcha request failed for ${dto.email}: ${e.message}`,
                detail: e.response?.data,
            });
            throw new UnauthorizedException();
        }
    }
}
