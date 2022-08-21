import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationRequestLogModule } from '@modules/admin-log/integration-request-log/integration-request-log.module';
import { JobLogModule } from '@modules/admin-log/job-log/job-log.module';
import { RawInfringementLogModule } from '@modules/admin-log/raw-infringement-log/raw-infringement-log.module';
import { RequestInformationLogModule } from '@modules/admin-log/request-information-log/request-information-log.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, IntegrationRequestLogModule, RawInfringementLogModule, JobLogModule, RequestInformationLogModule],
    exports: [IntegrationRequestLogModule, RawInfringementLogModule, JobLogModule, RequestInformationLogModule],
})
export class AdminLogModule {}
