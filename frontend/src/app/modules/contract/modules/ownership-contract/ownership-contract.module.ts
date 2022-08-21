import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { ViewOwnershipContractComponent } from '@modules/contract/modules/ownership-contract/components/view-ownership-contract/view-ownership-contract.component';
import { OwnershipContractsPageComponent } from '@modules/contract/modules/ownership-contract/components/ownership-contracts-page/ownership-contracts-page.component';
import { CreateOwnershipContractComponent } from '@modules/contract/modules/ownership-contract/components/create-ownership-contract/create-ownership-contract.component';
import { ViewOwnershipContractsComponent } from '@modules/contract/modules/ownership-contract/components/view-ownership-contracts/view-ownership-contracts.component';
import { DocumentModule } from '@modules/document/document.module';
import { UploadOwnershipContractsPageComponent } from '@modules/contract/modules/ownership-contract/components/upload-ownership-contracts-page/upload-ownership-contracts-page.component';
import { I18NextModule } from 'angular-i18next';

@NgModule({
    declarations: [
        ViewOwnershipContractComponent,
        ViewOwnershipContractsComponent,
        CreateOwnershipContractComponent,
        OwnershipContractsPageComponent,
        UploadOwnershipContractsPageComponent,
    ],
    imports: [CommonModule, SharedModule, DocumentModule, I18NextModule],
    exports: [
        ViewOwnershipContractComponent,
        ViewOwnershipContractsComponent,
        CreateOwnershipContractComponent,
        OwnershipContractsPageComponent,
    ],
    entryComponents: [],
})
export class OwnershipContractModule {}
