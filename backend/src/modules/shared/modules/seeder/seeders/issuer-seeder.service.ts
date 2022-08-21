import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Issuer } from '@entities';
import { plainToClass } from 'class-transformer';
import { ATGIssuerIntegrationDetails } from '@modules/shared/models/issuer-integration-details.model';

@Injectable()
export class IssuerSeederService extends BaseSeederService<Issuer> {
    protected seederName: string = 'Issuer';

    constructor() {
        super();
    }

    async setSeedData() {
        this.seedData = [];

        if (this.isDevelopment) {
            this.seedData = [
                ...this.seedData,
                ...[
                    {
                        name: 'TestIssuerOne',
                        code: '1234',
                        email: 'testissuerone@roadprotect.co.il',
                    },
                    {
                        name: 'TestATGIssuerOne',
                        code: '8300',
                        email: 'atg-issuer-one@roadprotect.co.il',
                        integrationDetails: plainToClass(ATGIssuerIntegrationDetails, { code: '1234', isPCI: 1 }),
                        provider: 'ATG',
                    },
                    {
                        name: 'TestATGIssuerTwo',
                        code: '8200',
                        email: 'atg-issuer-two@roadprotect.co.il',
                        integrationDetails: plainToClass(ATGIssuerIntegrationDetails, { code: '4311', isPCI: 0 }),
                        provider: 'ATG',
                    },
                ],
            ];
        }
    }

    async seedItemFunction(item: Partial<Issuer>) {
        return Issuer.create(item).save();
    }
}
