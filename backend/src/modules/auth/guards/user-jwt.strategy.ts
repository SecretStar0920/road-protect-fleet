import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAuthService, UserTokenPayload } from '@modules/auth/services/user-auth.service';
import { Config } from '@config/config';
import { isNil } from 'lodash';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: UserAuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Config.get.security.userJwt.secret,
        });
    }

    async validate(payload: UserTokenPayload): Promise<IdentityDto> {
        if (isNil(payload.email) || isNil(payload.userId)) {
            throw new UnauthorizedException();
        }
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        const accountId = payload.accountId;
        const accountUserId = payload.accountUserId;

        return {
            user,
            accountId,
            accountUserId,
        };
    }
}
