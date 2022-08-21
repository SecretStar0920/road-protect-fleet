import * as fromContract from '@modules/contract/ngrx/contract.reducer';
import { ContractsPageComponent } from '@modules/contract/components/contracts-page/contracts-page.component';
import { CommonModule } from '@angular/common';
import { CreateContractComponent } from '@modules/contract/components/create-contract/create-contract.component';
import { CreateContractModalComponent } from '@modules/contract/components/create-contract/create-contract-modal/create-contract-modal.component';
import { CreateContractPageComponent } from '@modules/contract/components/create-contract/create-contract-page/create-contract-page.component';
import { DeleteContractComponent } from './components/delete-contract/delete-contract.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateContractComponent } from '@modules/contract/components/update-contract/update-contract.component';
import { ViewContractComponent } from '@modules/contract/components/view-contract/view-contract.component';
import { ViewContractModalComponent } from '@modules/contract/components/view-contract/view-contract-modal/view-contract-modal.component';
import { ViewContractPageComponent } from '@modules/contract/components/view-contract/view-contract-page/view-contract-page.component';
import { ViewContractsComponent } from '@modules/contract/components/view-contracts/view-contracts.component';
import { ContractEffects } from '@modules/contract/ngrx/contract.effects';
import { DocumentModule } from '@modules/document/document.module';
import { AddContractDocumentComponent } from './components/add-contract-document/add-contract-document.component';
import { UpdateContractDatesComponent } from './components/view-contract/update-contract-dates/update-contract-dates.component';
import { LeaseContractModule } from '@modules/contract/modules/lease-contract/lease-contract.module';
import { OwnershipContractModule } from '@modules/contract/modules/ownership-contract/ownership-contract.module';
import { ViewContractsAdvancedComponent } from '@modules/contract/components/view-contracts-advanced/view-contracts-advanced.component';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { BulkCreateLeaseContractDocumentModalComponent } from '@modules/contract/components/bulk-create-lease-contract-document-modal/bulk-create-lease-contract-document-modal.component';
import { DriverContractModule } from '@modules/contract/modules/driver-contract/driver-contract.module';

@NgModule({
    declarations: [
        ViewContractComponent,
        ViewContractsComponent,
        CreateContractComponent,
        UpdateContractComponent,
        CreateContractModalComponent,
        BulkCreateLeaseContractDocumentModalComponent,
        CreateContractPageComponent,
        ViewContractPageComponent,
        ViewContractModalComponent,
        ContractsPageComponent,
        DeleteContractComponent,
        AddContractDocumentComponent,
        UpdateContractDatesComponent,
        ViewContractsAdvancedComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('contract', fromContract.reducer),
        EffectsModule.forFeature([ContractEffects]),
        DocumentModule,
        LeaseContractModule,
        OwnershipContractModule,
        DriverContractModule,
        GeneratedDocumentModule,
    ],
    exports: [
        ViewContractComponent,
        ViewContractsComponent,
        CreateContractComponent,
        UpdateContractComponent,
        CreateContractModalComponent,
        CreateContractPageComponent,
        ViewContractPageComponent,
        ViewContractModalComponent,
        ContractsPageComponent,
        DeleteContractComponent,
        ViewContractsAdvancedComponent,
    ],
    entryComponents: [CreateContractModalComponent, ViewContractModalComponent],
})
export class ContractModule {}
