import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Config } from '@config/config';
import { isNil } from 'lodash';
import { ClientAuthService } from '@modules/auth/services/client-auth.service';

@Injectable()
export class ClientJwtStrategy extends PassportStrategy(Strategy, 'client') {
    constructor(private readonly clientAuthService: ClientAuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Config.get.security.clientJwt.secret,
        });
    }

    async validate(payload: { clientId: number }) {
        if (isNil(payload.clientId)) {
            throw new UnauthorizedException();
        }
        const client = await this.clientAuthService.validateClient(payload);
        if (isNil(client)) {
            throw new UnauthorizedException();
        }
        return client;
    }
}
