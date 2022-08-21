import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Issuer } from '@entities';
import { CreateLeaseContractDto } from '@modules/contract/modules/lease-contract/controllers/lease-contract.controller';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LeaseContractSeederService extends BaseSeederService<CreateLeaseContractDto> {
    protected seederName: string = 'Lease Contract';

    constructor(private createLeaseContractService: CreateLeaseContractService) {
        super();
    }

    async setSeedData() {
        this.seedData = [];

        if (this.isDevelopment) {
            this.seedData = [
                ...this.seedData,
                ...[
                    {
                        vehicle: 'TESTVEHICLEONE',
                        startDate: moment().subtract(1, 'month').toISOString(),
                        endDate: moment().add(1, 'month').toISOString(),
                        user: 'USER_IDENTIFIER',
                        owner: 'OWNER_IDENTIFIER',
                    },
                ],
            ];
        }
    }

    async seedItemFunction(item: CreateLeaseContractDto) {
        item = plainToClass(CreateLeaseContractDto, item);
        return this.createLeaseContractService.createContractAndLinkInfringements(item);
    }
}
