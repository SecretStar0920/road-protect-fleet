import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccountRelationModule } from '@modules/account-relation/account-relation.module';
import { AccountReportingModule } from '@modules/account-reporting/account-reporting.module';
import { AccountUserModule } from '@modules/account-user/account-user.module';
import { CreateAccountModalComponent } from '@modules/account/components/create-account/create-account-modal/create-account-modal.component';
import { CreateAccountPageComponent } from '@modules/account/components/create-account/create-account-page/create-account-page.component';
import { DeactivateAccountComponent } from '@modules/account/components/deactivate-account/deactivate-account.component';
import { UpdateAccountComponent } from '@modules/account/components/update-account/update-account.component';
import { ViewAccountsAdvancedComponent } from '@modules/account/components/view-account-advanced/view-accounts-advanced.component';
import { ViewAccountModalComponent } from '@modules/account/components/view-account/view-account-modal/view-account-modal.component';
import { ViewAccountComponent } from '@modules/account/components/view-account/view-account.component';
import { AccountEffects } from '@modules/account/ngrx/account.effects';
import * as fromAccount from '@modules/account/ngrx/account.reducer';
import { AccountsPageComponent } from '@modules/account/pages/accounts-page/accounts-page.component';
import { CurrentAccountContractsPageComponent } from '@modules/account/pages/current-account-contracts-page/current-account-contracts-page.component';
import { CurrentAccountInfringementsPageComponent } from '@modules/account/pages/current-account-infringements-page/current-account-infringements-page.component';
import { CurrentAccountNominationsPageComponent } from '@modules/account/pages/current-account-nominations-page/current-account-nominations-page.component';
import { CurrentAccountRelationsPageComponent } from '@modules/account/pages/current-account-relations-page/current-account-relations-page.component';
import { CurrentAccountUsersPageComponent } from '@modules/account/pages/current-account-users-page/current-account-users-page.component';
import { CurrentAccountVehiclesPageComponent } from '@modules/account/pages/current-account-vehicles-page/current-account-vehicles-page.component';
import { UploadAccountsPageComponent } from '@modules/account/pages/upload-accounts-page/upload-accounts-page.component';
import { ViewAccountPageComponent } from '@modules/account/pages/view-account-page/view-account-page.component';
import { ContractModule } from '@modules/contract/contract.module';
import { DocumentModule } from '@modules/document/document.module';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { LogModule } from '@modules/log/log.module';
import { NominationModule } from '@modules/nomination/nomination.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { SharedModule } from '@modules/shared/shared.module';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AccountDropdownComponent } from './components/account-dropdown/account-dropdown.component';
import { AccountRoleTagComponent } from './components/account-role-tag/account-role-tag.component';
import { AddPowerOfAttorneyComponent } from './components/add-power-of-attorney/add-power-of-attorney.component';
import { ChangeCurrentAccountComponent } from './components/change-current-account/change-current-account.component';
import { ChangingAccountPageComponent } from './components/change-current-account/changing-account-page/changing-account-page.component';
import { ChangeToAccountComponent } from './components/change-to-account/change-to-account.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { EmailAccountInfringementReportComponent } from './components/email-account-infringement-report/email-account-infringement-report.component';
import { ViewAccountContractsComponent } from './components/view-account-contracts/view-account-contracts.component';
import { ViewAccountVehiclesComponent } from './components/view-account-vehicles/view-account-vehicles.component';
import { CurrentAccountPageComponent } from './pages/current-account-page/current-account-page.component';

@NgModule({
    declarations: [
        ViewAccountComponent,
        UpdateAccountComponent,
        CreateAccountModalComponent,
        CreateAccountPageComponent,
        ViewAccountPageComponent,
        ViewAccountModalComponent,
        AccountsPageComponent,
        DeleteAccountComponent,
        CurrentAccountPageComponent,
        CurrentAccountUsersPageComponent,
        CurrentAccountVehiclesPageComponent,
        CurrentAccountNominationsPageComponent,
        CurrentAccountInfringementsPageComponent,
        CurrentAccountContractsPageComponent,
        ViewAccountVehiclesComponent,
        ViewAccountContractsComponent,
        AccountRoleTagComponent,
        DeactivateAccountComponent,
        UploadAccountsPageComponent,
        ChangeCurrentAccountComponent,
        ViewAccountsAdvancedComponent,
        ChangeToAccountComponent,
        AddPowerOfAttorneyComponent,
        ChangingAccountPageComponent,
        CurrentAccountRelationsPageComponent,
        EmailAccountInfringementReportComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        AccountUserModule,
        StoreModule.forFeature('account', fromAccount.reducer),
        EffectsModule.forFeature([AccountEffects]),
        VehicleModule,
        LogModule,
        NominationModule,
        InfringementModule,
        DocumentModule,
        AccountReportingModule,
        ContractModule,
        GeneratedDocumentModule,
        AccountRelationModule,
        PaymentModule,
    ],
    exports: [
        ViewAccountComponent,
        UpdateAccountComponent,
        CreateAccountModalComponent,
        CreateAccountPageComponent,
        ViewAccountPageComponent,
        ViewAccountModalComponent,
        AccountsPageComponent,
        DeleteAccountComponent,
        EmailAccountInfringementReportComponent,
        AccountDropdownComponent,
        AccountRoleTagComponent,
        DeactivateAccountComponent,
        UploadAccountsPageComponent,
        ChangeCurrentAccountComponent,
        ChangingAccountPageComponent,
    ],
    entryComponents: [
        CreateAccountModalComponent,
        ViewAccountModalComponent,
        AddPowerOfAttorneyComponent,
        EmailAccountInfringementReportComponent,
    ],
})
export class AccountModule {}
