import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Account } from '@entities';
import { CreateClientService } from '@modules/client/services/create-client.service';
import { CreateClientDto } from '@modules/client/controllers/client.controller';
import { plainToClass } from 'class-transformer';
import { Config } from '@config/config';

@Injectable()
export class ClientSeederService extends BaseSeederService<CreateClientDto> {
    protected seederName: string = 'Client';

    constructor(private createClientService: CreateClientService) {
        super();
    }

    async setSeedData() {
        this.seedData = [
            {
                name: 'atg',
            },
            {
                name: 'old-israel-fleet',
            },
            {
                name: Config.get.infringement.infringementUploadClientName,
            },
        ];

        if (this.isDevelopment) {
            this.seedData = [...this.seedData, ...[]];
        }
    }

    async seedItemFunction(item) {
        item = plainToClass(CreateClientDto, item);
        return this.createClientService.createClient(item);
    }
}
