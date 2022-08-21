import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Issuer } from '@entities';
import * as moment from 'moment';
import { CreateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract.service';
import { plainToClass } from 'class-transformer';
import { CreateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/controllers/create-ownership-contract.dto';

@Injectable()
export class OwnershipContractSeederService extends BaseSeederService<CreateOwnershipContractDto> {
    protected seederName: string = 'Ownership Contract';

    constructor(private createOwnershipContractService: CreateOwnershipContractService) {
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
                        startDate: moment().subtract(1, 'year').toISOString(),
                        endDate: moment().add(1, 'year').toISOString(),
                        owner: 'OWNER_IDENTIFIER',
                    },
                ],
            ];
        }
    }

    async seedItemFunction(item: CreateOwnershipContractDto) {
        item = plainToClass(CreateOwnershipContractDto, item);

        return this.createOwnershipContractService.createOwnershipContractAndLinkInfringements(item);
    }
}
