import { QueueModule } from '@modules/queue/queue.module';
import { StreetModule } from '@modules/street/street.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@modules/shared/shared.module';
import { UserModule } from '@modules/user/user.module';
import { AccountModule } from '@modules/account/account.module';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { SeederModule } from '@seeder/seeder.module';
import { AuthModule } from '@modules/auth/auth.module';
import { IssuerModule } from '@modules/issuer/issuer.module';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { RoleModule } from '@modules/role/role.module';
import { ContractModule } from '@modules/contract/contract.module';
import { LogModule } from '@modules/log/log.module';
import { NominationModule } from '@modules/nomination/nomination.module';
import { LocationModule } from '@modules/location/location.module';
import { PermissionModule } from '@modules/permission/permission.module';
import { AccountReportingModule } from '@modules/reporting/account-reporting/account-reporting.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { LeaseContractModule } from '@modules/contract/modules/lease-contract/lease-contract.module';
import { OwnershipContractModule } from '@modules/contract/modules/ownership-contract/ownership-contract.module';
import { AdminReportingModule } from '@modules/reporting/admin-reporting/admin-reporting.module';
import { WeeklyReportingModule } from '@modules/reporting/weekly-report/weekly-reporting.module';
import { ClientModule } from '@modules/client/client.module';
import { RawInfringementModule } from '@modules/raw-infringement/raw-infringement.module';
import { MetabaseModule } from '@modules/metabase/metabase.module';
import { DocumentTemplateModule } from '@modules/document-template/document-template.module';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { LocaleModule } from '@modules/locale/locale.module';
import { InfringementNoteModule } from '@modules/infringement-note/infringement-note.module';
import { AccountRelationModule } from '@modules/account-relation/account-relation.module';
import { AccountRelationDocumentModule } from '@modules/account-relation-document/account-relation-document.module';
import { AutocompleteModule } from '@modules/autocomplete/autocomplete.module';
import { PartnersModule } from '@modules/partners/partners.module';
import { IntegrationTestModule } from '@modules/integration-test/integration-test.module';
import { IntegrationRequestLogModule } from '@modules/integration-request/integration-request-log.module';
import { CrawlersModule } from '@modules/crawlers/crawlers.module';
import { JobModule } from '@modules/job/job.module';
import { GraphingModule } from '@modules/graphing/graphing.module';
import { RateLimitModule } from '@modules/rate-limit/rate-limit.module';
import { PartialInfringementModule } from '@modules/partial-infringement/partial-infringement.module';
import { AsyncLocalStorageMiddleware } from '@middleware/async-local-storage.middleware';
import { RequestInformationLogModule } from '@modules/request-information-log/request-information-log.module';
import { DriverModule } from '@modules/driver/driver.module';
import { DriverContractModule } from '@modules/contract/modules/driver-contract/driver-contract.module';
import { HomeReportingModule } from '@modules/reporting/home-reporting/home-reporting.module';

@Module({
    imports: [
        SharedModule,
        SeederModule,
        UserModule,
        AuthModule,
        AccountModule,
        VehicleModule,
        IssuerModule,
        InfringementModule,
        RoleModule,
        ContractModule,
        LeaseContractModule,
        OwnershipContractModule,
        DriverContractModule,
        AdminReportingModule,
        AccountReportingModule,
        HomeReportingModule,
        WeeklyReportingModule,
        LogModule,
        NominationModule,
        LocationModule,
        PermissionModule,
        PaymentModule,
        ClientModule,
        RawInfringementModule,
        MetabaseModule,
        DocumentTemplateModule,
        GeneratedDocumentModule,
        LocaleModule,
        InfringementNoteModule,
        AccountRelationModule,
        AccountRelationDocumentModule,
        PartnersModule,
        AutocompleteModule,
        IntegrationTestModule,
        StreetModule,
        IntegrationRequestLogModule,
        PartialInfringementModule,
        DriverModule,
        CrawlersModule,
        QueueModule,
        JobModule,
        GraphingModule,
        RateLimitModule,
        RequestInformationLogModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AsyncLocalStorageMiddleware).forRoutes('*');
    }
}
