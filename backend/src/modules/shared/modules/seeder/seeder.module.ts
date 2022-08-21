import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserSeederService } from './seeders/user-seeder.service';
import { SharedModule } from '@modules/shared/shared.module';
import { PermissionSeederService } from '@seeder/seeders/permission-seeder.service';
import { RoleSeederService } from '@seeder/seeders/role-seeder.service';
import { IssuerSeederService } from '@seeder/seeders/issuer-seeder.service';
import { UserModule } from '@modules/user/user.module';
import { AccountSeederService } from '@seeder/seeders/account-seeder.service';
import { AccountModule } from '@modules/account/account.module';
import { ClientSeederService } from '@seeder/seeders/client-seeder.service';
import { ClientModule } from '@modules/client/client.module';
import { DocumentTemplateModule } from '@modules/document-template/document-template.module';
import { DocumentTemplateSeederService } from '@seeder/seeders/document-template-seeder.service';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { VehicleSeederService } from '@seeder/seeders/vehicle-seeder.service';
import { LeaseContractModule } from '@modules/contract/modules/lease-contract/lease-contract.module';
import { OwnershipContractModule } from '@modules/contract/modules/ownership-contract/ownership-contract.module';
import { LeaseContractSeederService } from '@seeder/seeders/lease-contract-seeder.service';
import { OwnershipContractSeederService } from '@seeder/seeders/ownership-contract-seeder.service';
import { ContractModule } from '@modules/contract/contract.module';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { InfringementSeederService } from '@seeder/seeders/infringement-seeder.service';
import { InfringementNoteModule } from '@modules/infringement-note/infringement-note.module';

@Module({
    imports: [
        SharedModule,
        UserModule,
        AccountModule,
        ClientModule,
        DocumentTemplateModule,
        VehicleModule,
        ContractModule,
        LeaseContractModule,
        OwnershipContractModule,
        InfringementModule,
        InfringementNoteModule,
    ],
    providers: [
        SeederService,
        UserSeederService,
        PermissionSeederService,
        RoleSeederService,
        IssuerSeederService,
        AccountSeederService,
        ClientSeederService,
        DocumentTemplateSeederService,
        VehicleSeederService,
        LeaseContractSeederService,
        OwnershipContractSeederService,
        InfringementSeederService,
    ],
})
export class SeederModule {}
