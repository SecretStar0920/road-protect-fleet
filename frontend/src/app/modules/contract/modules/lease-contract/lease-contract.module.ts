import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { ViewLeaseContractComponent } from '@modules/contract/modules/lease-contract/components/view-lease-contract/view-lease-contract.component';
import { LeaseContractsPageComponent } from '@modules/contract/modules/lease-contract/components/lease-contracts-page/lease-contracts-page.component';
import { CreateLeaseContractComponent } from '@modules/contract/modules/lease-contract/components/create-lease-contract/create-lease-contract.component';
import { ViewLeaseContractsComponent } from '@modules/contract/modules/lease-contract/components/view-lease-contracts/view-lease-contracts.component';
import { DocumentModule } from '@modules/document/document.module';
import { UploadLeaseContractsPageComponent } from '@modules/contract/modules/lease-contract/components/upload-lease-contracts-page/upload-lease-contracts-page.component';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { ContractOcrStatusTagComponent } from '@modules/contract/modules/lease-contract/components/contract-ocr-status-tag/contract-ocr-status-tag.component';
import { ViewOcrResultComponent } from '@modules/contract/modules/lease-contract/components/view-ocr-result/view-ocr-result.component';

@NgModule({
    declarations: [
        ViewLeaseContractComponent,
        ViewLeaseContractsComponent,
        CreateLeaseContractComponent,
        LeaseContractsPageComponent,
        UploadLeaseContractsPageComponent,
        ContractOcrStatusTagComponent,
        ViewOcrResultComponent,
    ],
    imports: [CommonModule, SharedModule, DocumentModule, GeneratedDocumentModule],
    exports: [
        ViewLeaseContractComponent,
        ViewLeaseContractsComponent,
        CreateLeaseContractComponent,
        LeaseContractsPageComponent,
        ContractOcrStatusTagComponent,
    ],
    entryComponents: [],
})
export class LeaseContractModule {}
