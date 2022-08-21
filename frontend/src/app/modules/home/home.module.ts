import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLogModule } from '@modules/admin-log/admin-log.module';
import { AppLayoutComponent } from './components/layout/app-layout.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { PageComponent } from './components/layout/page/page.component';
import { SharedModule } from '@modules/shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { HomeRoutingModule } from '@modules/home/home-routing.module';
import { AccountModule } from '@modules/account/account.module';
import { UserModule } from '@modules/user/user.module';
import { AccountUserModule } from '@modules/account-user/account-user.module';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { IssuerModule } from '@modules/issuer/issuer.module';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { RoleModule } from '@modules/role/role.module';
import { DocumentModule } from '@modules/document/document.module';
import { SpreadsheetModule } from '@modules/shared/modules/spreadsheet/spreadsheet.module';
import { GlobalLoadingModule } from '@modules/shared/modules/global-loading/global-loading.module';
import { AdminReportingModule } from '@modules/admin-reporting/admin-reporting.module';
import { GlobalErrorModule } from '@modules/shared/modules/global-error/global-error.module';
import { LogModule } from '@modules/log/log.module';
import { NominationModule } from '@modules/nomination/nomination.module';
import { LocationModule } from '@modules/location/location.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { LeaseContractModule } from '@modules/contract/modules/lease-contract/lease-contract.module';
import { OwnershipContractModule } from '@modules/contract/modules/ownership-contract/ownership-contract.module';
import { RealtimeModule } from '@modules/shared/modules/realtime/realtime.module';
import { AuthModule } from '@modules/auth/auth.module';
import { FirstLoginComponent } from '@modules/home/components/first-login/first-login.component';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { InfringementNoteModule } from '@modules/infringement-note/infringement-note.module';
import { AccountRelationModule } from '@modules/account-relation/account-relation.module';
import { AccountRelationDocumentModule } from '@modules/account-relation-document/account-relation-document.module';
import { CookieService } from 'ngx-cookie-service';
import { GraphingModule } from '@modules/graphing/graphing.module';
import { PartialInfringementModule } from '@modules/admin-partial-infringement/partial-infringement.module';
import { SummaryIndicatorsModule } from '@modules/summary-indicators/summary-indicators.module';
import { InfringementProjectionModule } from '../infringement-projection/infringement-projection.module';
import { DriverModule } from '@modules/admin-driver/driver.module';
import { DriverContractModule } from '@modules/contract/modules/driver-contract/driver-contract.module';
import { StoreModule } from '@ngrx/store';
import * as fromHomeReporting from '@modules/home/ngrx/home-reporting.reducer';
import { EffectsModule } from '@ngrx/effects';
import { HomeReportingEffects } from '@modules/home/ngrx/home-reporting.effects';
import { HomeNumberCardComponent } from '@modules/home/components/home/home-number-card/home-number-card.component';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
    declarations: [
        AppLayoutComponent,
        SidebarComponent,
        HeaderComponent,
        PageComponent,
        HomeComponent,
        HomeNumberCardComponent,
        FirstLoginComponent,
    ],
    exports: [AppLayoutComponent, FirstLoginComponent, PageComponent],
    imports: [
        CommonModule,
        SharedModule,
        AccountModule,
        AccountUserModule,
        UserModule,
        VehicleModule,
        IssuerModule,
        InfringementModule,
        RoleModule,
        DocumentModule,
        SpreadsheetModule,
        AdminReportingModule,
        LogModule,
        NominationModule,
        LocationModule,
        GlobalErrorModule,
        GlobalLoadingModule,
        PaymentModule,
        LeaseContractModule,
        OwnershipContractModule,
        DriverContractModule,
        RealtimeModule,
        GeneratedDocumentModule,
        HomeRoutingModule,
        AuthModule,
        InfringementNoteModule,
        AccountRelationModule,
        AccountRelationDocumentModule,
        PartialInfringementModule,
        DriverModule,
        AdminLogModule,
        GraphingModule,
        SummaryIndicatorsModule,
        InfringementProjectionModule,
        StoreModule.forFeature(fromHomeReporting.homeReportingFeatureKey, fromHomeReporting.reducer),
        EffectsModule.forFeature([HomeReportingEffects]),
        NzCardModule,
    ],
    providers: [CookieService],
})
export class HomeModule {}
