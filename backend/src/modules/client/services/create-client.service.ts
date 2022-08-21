import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { CreateClientDto } from '@modules/client/controllers/client.controller';
import { Client } from '@entities';
import { ClientAuthService } from '@modules/auth/services/client-auth.service';

@Injectable()
export class CreateClientService {
    constructor(private logger: Logger, private clientAuthService: ClientAuthService) {}

    async createClient(dto: CreateClientDto): Promise<Client> {
        this.logger.log({ message: 'Creating client', detail: dto, fn: this.createClient.name });

        // Create
        let client = Client.create({
            name: dto.name,
        });

        // Save
        client = await client.save();

        // Generate token
        this.logger.debug({ message: 'Generating token', detail: null, fn: this.createClient.name });

        const token = await this.clientAuthService.generateToken(client);

        // Update client
        client.token = token;
        await client.save();

        this.logger.debug({ message: 'Generated client', detail: null, fn: this.createClient.name });

        return client;
    }
}
