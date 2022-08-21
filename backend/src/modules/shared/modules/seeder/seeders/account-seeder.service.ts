import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Account, AccountRole } from '@entities';
import { CreateAccountV1Service } from '@modules/account/services/create-account-v1.service';
import { CreateAccountV1Dto } from '@modules/account/controllers/create-account-v1.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AccountSeederService extends BaseSeederService<CreateAccountV1Dto> {
    protected seederName: string = 'Account';

    constructor(private createAccountService: CreateAccountV1Service) {
        super();
    }

    async setSeedData() {
        this.seedData = [];

        if (this.isDevelopment) {
            this.seedData = [
                ...this.seedData,
                ...[
                    {
                        name: 'TEST_USER',
                        identifier: 'USER_IDENTIFIER',
                        isVerified: true,
                        primaryContact: 'liam@entrostat.com',
                        role: AccountRole.User,
                        streetName: 'USER_STREET',
                        streetNumber: 'USER_STREET_NUMBER',
                        city: 'Johannesburg',
                        country: 'South Africa',
                    },
                    {
                        name: 'TEST_OWNER',
                        identifier: 'OWNER_IDENTIFIER',
                        isVerified: true,
                        primaryContact: 'liam@entrostat.com',
                        role: AccountRole.Owner,
                        streetName: 'OWNER_STREET',
                        streetNumber: 'OWNER_STREET_NUMBER',
                        city: 'Johannesburg',
                        country: 'South Africa',
                    },
                    {
                        name: 'TEST_HYBRID',
                        identifier: 'HYBRID_IDENTIFIER',
                        isVerified: true,
                        primaryContact: 'liam@entrostat.com',
                        role: AccountRole.Hybrid,
                        streetName: 'HYBRID_STREET',
                        streetNumber: 'HYBRID_STREET_NUMBER',
                        city: 'Johannesburg',
                        country: 'South Africa',
                    },
                ],
            ];
        }
    }

    async seedItemFunction(item) {
        item = plainToClass(CreateAccountV1Dto, item);
        return this.createAccountService.createAccount(item);
    }
}
