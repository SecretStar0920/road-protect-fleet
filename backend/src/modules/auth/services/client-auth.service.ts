import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { JwtService } from '@nestjs/jwt';
import { Client } from '@entities';
import { Config } from '@config/config';

@Injectable()
export class ClientAuthService {
    constructor(private logger: Logger, private readonly jwtService: JwtService) {}

    async validateClient(payload: { clientId: number }): Promise<Client> {
        const client = await Client.createQueryBuilder('client')
            .where('client.clientId = :clientId', { clientId: payload.clientId })
            .getOne();

        if (client) {
            await Client.incrementUsage(client.clientId);
        }

        return client;
    }

    async generateToken(client: Client): Promise<string> {
        return this.jwtService.signAsync(
            {
                clientId: client.clientId,
            },
            { expiresIn: Config.get.security.clientJwt.expiry },
        );
    }
}
