import { Injectable } from '@nestjs/common';
import { UserSeederService } from '@seeder/seeders/user-seeder.service';
import { PermissionSeederService } from '@seeder/seeders/permission-seeder.service';
import { RoleSeederService } from '@seeder/seeders/role-seeder.service';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { IssuerSeederService } from '@seeder/seeders/issuer-seeder.service';
import { AccountSeederService } from '@seeder/seeders/account-seeder.service';
import { ClientSeederService } from '@seeder/seeders/client-seeder.service';
import { DocumentTemplateSeederService } from '@seeder/seeders/document-template-seeder.service';
import { VehicleSeederService } from '@seeder/seeders/vehicle-seeder.service';
import { LeaseContractSeederService } from '@seeder/seeders/lease-contract-seeder.service';
import { OwnershipContractSeederService } from '@seeder/seeders/ownership-contract-seeder.service';
import { InfringementSeederService } from '@seeder/seeders/infringement-seeder.service';

@Injectable()
export class SeederService {
    seeders: BaseSeederService[] = [
        this.userSeeder,
        this.permissionSeeder,
        this.roleSeeder,
        this.vehicleSeederService,
        this.issuerSeederService,
        this.accountSeederService,
        this.clientSeederService,
        this.documentTemplateSeederService,
        this.leaseContractSeederService,
        this.ownershipContractSeederService,
        this.infringementSeederService,
    ];

    constructor(
        private readonly userSeeder: UserSeederService,
        private readonly permissionSeeder: PermissionSeederService,
        private readonly roleSeeder: RoleSeederService,
        private readonly issuerSeederService: IssuerSeederService,
        private readonly accountSeederService: AccountSeederService,
        private readonly clientSeederService: ClientSeederService,
        private readonly documentTemplateSeederService: DocumentTemplateSeederService,
        private readonly vehicleSeederService: VehicleSeederService,
        private readonly leaseContractSeederService: LeaseContractSeederService,
        private readonly ownershipContractSeederService: OwnershipContractSeederService,
        private readonly infringementSeederService: InfringementSeederService,
    ) {}

    async seed() {
        for (const seeder of this.seeders) {
            await seeder.run();
        }
    }
}
