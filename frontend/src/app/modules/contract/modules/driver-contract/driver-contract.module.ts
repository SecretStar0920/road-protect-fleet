import { NgModule } from '@angular/core';
import { ViewDriverContractsComponent } from '@modules/contract/modules/driver-contract/components/view-driver-contracts/view-driver-contracts.component';
import { DriverContractsPageComponent } from '@modules/contract/modules/driver-contract/components/driver-contracts-page/driver-contracts-page.component';
import { SharedModule } from '@modules/shared/shared.module';
import { CommonModule } from '@angular/common';
import { CreateDriverContractComponent } from '@modules/contract/modules/driver-contract/components/create-driver-contract/create-driver-contract.component';
import { UploadDriverContractsPageComponent } from '@modules/contract/modules/driver-contract/components/upload-driver-contracts-page/upload-driver-contracts-page.component';
import { I18NextModule } from 'angular-i18next';
import { ViewDriverContractComponent } from '@modules/contract/modules/driver-contract/components/view-driver-contract/view-driver-contract.component';
import { DocumentModule } from '@modules/document/document.module';
import { DriverModule } from '@modules/admin-driver/driver.module';

@NgModule({
    declarations: [
        ViewDriverContractComponent,
        ViewDriverContractsComponent,
        CreateDriverContractComponent,
        DriverContractsPageComponent,
        UploadDriverContractsPageComponent,
    ],
    imports: [CommonModule, SharedModule, DocumentModule, I18NextModule, DriverModule],
    exports: [ViewDriverContractComponent, ViewDriverContractsComponent, CreateDriverContractComponent, DriverContractsPageComponent],
    entryComponents: [],
})
export class DriverContractModule {}
