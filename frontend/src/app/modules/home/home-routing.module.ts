import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewIntegrationRequestLogPageComponent } from '@modules/admin-log/integration-request-log/pages/view-integration-request-log-page/view-integration-request-log-page.component';
import { IntegrationRequestLogsPageComponent } from '@modules/admin-log/integration-request-log/pages/integration-request-logs-page/integration-request-logs-page.component';
import { JobLogsPageComponent } from '@modules/admin-log/job-log/pages/job-logs-page/job-logs-page.component';
import { ViewJobLogPageComponent } from '@modules/admin-log/job-log/pages/view-job-log-page/view-job-log-page.component';
import { RawInfringementLogsPageComponent } from '@modules/admin-log/raw-infringement-log/pages/raw-infringement-logs-page/raw-infringement-logs-page.component';
import { ViewRawInfringementLogPageComponent } from '@modules/admin-log/raw-infringement-log/pages/view-raw-infringement-log-page/view-raw-infringement-log-page.component';
import { AppLayoutComponent } from '@modules/home/components/layout/app-layout.component';
import { HomeComponent } from '@modules/home/components/home/home.component';
import { AccountsPageComponent } from '@modules/account/pages/accounts-page/accounts-page.component';
import { CreateAccountPageComponent } from '@modules/account/components/create-account/create-account-page/create-account-page.component';
import { ViewAccountPageComponent } from '@modules/account/pages/view-account-page/view-account-page.component';
import { IntegrationTestPageComponent } from '@modules/integration-test/components/integration-testing-page/integration-test-page.component';
import { ViewUserPageComponent } from '@modules/user/components/view-user/view-user-page/view-user-page.component';
import { UsersPageComponent } from '@modules/user/components/users-page/users-page.component';
import { CreateUserPageComponent } from '@modules/user/components/create-user/create-user-page/create-user-page.component';
import { CurrentAccountPageComponent } from '@modules/account/pages/current-account-page/current-account-page.component';
import { CreateVehiclePageComponent } from '@modules/vehicle/components/create-vehicle/create-vehicle-page/create-vehicle-page.component';
import { VehiclesPageComponent } from '@modules/vehicle/components/vehicles-page/vehicles-page.component';
import { ViewVehiclePageComponent } from '@modules/vehicle/components/view-vehicle/view-vehicle-page/view-vehicle-page.component';
import { CreateIssuerPageComponent } from '@modules/issuer/pages/create-issuer-page/create-issuer-page.component';
import { ViewIssuerPageComponent } from '@modules/issuer/components/view-issuer/view-issuer-page/view-issuer-page.component';
import { IssuersPageComponent } from '@modules/issuer/pages/issuers-page/issuers-page.component';
import { InfringementsPageComponent } from '@modules/infringement/components/infringements-page/infringements-page.component';
import { ViewInfringementPageComponent } from '@modules/infringement/components/view-infringement/view-infringement-page/view-infringement-page.component';
import { CreateInfringementPageComponent } from '@modules/infringement/components/create-infringement/create-infringement-page/create-infringement-page.component';
import { UploadInfringementsPageComponent } from '@modules/infringement/components/upload-infringements-page/upload-infringements-page.component';
import { UserType } from '@modules/shared/models/entities/user.model';
import { UserTypeGuard } from '@modules/auth/guards/user-type.guard';
import { AdminReportsPageComponent } from '@modules/admin-reporting/components/admin-reports-page/admin-reports-page.component';
import { CurrentAccountUsersPageComponent } from '@modules/account/pages/current-account-users-page/current-account-users-page.component';
import { CurrentAccountVehiclesPageComponent } from '@modules/account/pages/current-account-vehicles-page/current-account-vehicles-page.component';
import { CurrentAccountNominationsPageComponent } from '@modules/account/pages/current-account-nominations-page/current-account-nominations-page.component';
import { UploadAccountsPageComponent } from '@modules/account/pages/upload-accounts-page/upload-accounts-page.component';
import { UploadIssuersPageComponent } from '@modules/issuer/pages/upload-issuers-page/upload-issuers-page.component';
import { UploadVehiclesPageComponent } from '@modules/vehicle/components/upload-vehicles-page/upload-vehicles-page.component';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { PermissionGuard } from '@modules/auth/guards/permission.guard';
import { CurrentAccountInfringementsPageComponent } from '@modules/account/pages/current-account-infringements-page/current-account-infringements-page.component';
import { ChangingAccountPageComponent } from '@modules/account/components/change-current-account/changing-account-page/changing-account-page.component';
import { UploadLeaseContractsPageComponent } from '@modules/contract/modules/lease-contract/components/upload-lease-contracts-page/upload-lease-contracts-page.component';
import { UploadOwnershipContractsPageComponent } from '@modules/contract/modules/ownership-contract/components/upload-ownership-contracts-page/upload-ownership-contracts-page.component';
import { ContractsPageComponent } from '@modules/contract/components/contracts-page/contracts-page.component';
import { UploadPaymentsPageComponent } from '@modules/payment/components/upload-payments-page/upload-payments-page.component';
import { CurrentAccountContractsPageComponent } from '@modules/account/pages/current-account-contracts-page/current-account-contracts-page.component';
import { ViewContractPageComponent } from '@modules/contract/components/view-contract/view-contract-page/view-contract-page.component';
import i18next from 'i18next';
import { EditGeneratedDocumentPageComponent } from '@modules/generated-document/components/edit-generated-document-page/edit-generated-document-page.component';
import { MunicipallyRedirectNominationPageComponent } from '@modules/nomination/components/municipally-redirect-nomination-page/municipally-redirect-nomination-page.component';
import { CurrentAccountRelationsPageComponent } from '@modules/account/pages/current-account-relations-page/current-account-relations-page.component';
import { CreateAccountRelationPageComponent } from '@modules/account-relation/pages/create-account-relation-page/create-account-relation-page.component';
import { AccountRelationsPageComponent } from '@modules/account-relation/pages/account-relations-page/account-relations-page.component';
import { ViewAccountRelationPageComponent } from '@modules/account-relation/pages/view-account-relation-page/view-account-relation-page.component';
import { CreateAndLinkDocumentPageComponent } from '@modules/document/pages/create-and-link-document-page/create-and-link-document-page.component';
import { ViewPartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/view-partial-infringement-page/view-partial-infringement-page.component';
import { PartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/partial-infringement-page/partial-infringement.component';
import { CreatePartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/create-partial-infringement-page/create-partial-infringement-page.component';
import { ViewRequestInformationLogPageComponent } from '@modules/admin-log/request-information-log/components/view-request-information-log/view-request-information-log-page/view-request-information-log-page.component';
import { RequestInformationLogsPageComponent } from '@modules/admin-log/request-information-log/pages/request-information-logs-page/request-information-logs-page.component';
import { UploadPartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/upload-partial-infringements-page/upload-partial-infringement-page.component';
import { UploadDriverContractsPageComponent } from '@modules/contract/modules/driver-contract/components/upload-driver-contracts-page/upload-driver-contracts-page.component';
import { UploadDriverPageComponent } from '@modules/admin-driver/pages/upload-driver-page/upload-driver-page.component';
import { DriverPageComponent } from '@modules/admin-driver/pages/driver-page/driver.component';
import { CreateDriverPageComponent } from '@modules/admin-driver/pages/create-driver-page/create-driver-page.component';
import { ViewDriverPageComponent } from '@modules/admin-driver/pages/view-driver-page/view-driver-page.component';
import { InfringementProjectionOwnerPageComponent } from '@modules/infringement-projection/pages/infringement-projection-owner-page/infringement-projection-owner-page.component';
import { InfringementProjectionUserPageComponent } from '@modules/infringement-projection/pages/infringement-projection-user-page/infringement-projection-user-page.component';
import { InfringementProjectionHybridPageComponent } from '@modules/infringement-projection/pages/infringement-projection-hybrid-page/infringement-projection-hybrid-page.component';
import { SummaryIndicatorsPageComponent } from '@modules/summary-indicators/pages/summary-indicators-page/summary-indicators-page.component';
import { FetchPartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/fetch-partial-infringements-page/fetch-partial-infringement-page.component';
import { UploadOcrPartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/upload-ocr-partial-infringements-page/upload-ocr-partial-infringement-page.component';
import { AccountReportingPageComponent } from '@modules/graphing/account-reporting-page/account-reporting-page.component';

const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'account',
                data: {
                    breadcrumb: i18next.t('breadcrumb.account'),
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'profile',
                        pathMatch: 'full',
                    },
                    {
                        path: 'loading',
                        component: ChangingAccountPageComponent,
                    },
                    {
                        path: 'profile',
                        component: CurrentAccountPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.profile'),
                            permissions: [PERMISSIONS.ViewProfile],
                        },
                    },
                    {
                        path: 'users',
                        component: CurrentAccountUsersPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.users'),
                            permissions: [PERMISSIONS.ViewUsers],
                        },
                    },
                    {
                        path: 'vehicles',
                        component: CurrentAccountVehiclesPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.vehicles'),
                            permissions: [PERMISSIONS.ViewVehicles],
                        },
                    },
                    {
                        path: 'contracts',
                        component: CurrentAccountContractsPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.contracts'),
                            permissions: [PERMISSIONS.ViewVehicles],
                        },
                    },
                    {
                        path: 'nominations',
                        component: CurrentAccountNominationsPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.nominations'),
                            permissions: [PERMISSIONS.ViewInfringements],
                        },
                    },
                    {
                        path: 'infringements',
                        component: CurrentAccountInfringementsPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.infringements'),
                            permissions: [PERMISSIONS.ViewInfringements],
                        },
                    },
                    {
                        path: 'relations',
                        component: CurrentAccountRelationsPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.accountRelations'),
                            permissions: [PERMISSIONS.ViewAccountRelation],
                        },
                    },
                    {
                        path: 'reporting',
                        component: AccountReportingPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.reporting'),
                            permissions: [PERMISSIONS.FinanceReporting, PERMISSIONS.InfringementReporting, PERMISSIONS.VehicleReporting],
                        },
                    },
                    {
                        path: 'summary-indicators',
                        canActivate: [PermissionGuard],
                        component: SummaryIndicatorsPageComponent,
                        data: {
                            permissions: [PERMISSIONS.FinanceReporting, PERMISSIONS.InfringementReporting, PERMISSIONS.VehicleReporting],
                        },
                    },
                    {
                        path: 'infringement-projection',
                        canActivate: [PermissionGuard],
                        data: {
                            permissions: [PERMISSIONS.FinanceReporting, PERMISSIONS.InfringementReporting, PERMISSIONS.VehicleReporting],
                        },
                        component: InfringementProjectionHybridPageComponent,
                    },
                ],
            },
            {
                path: 'accounts',
                data: {
                    breadcrumb: i18next.t('breadcrumb.accounts'),
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: AccountsPageComponent,
                        canActivate: [UserTypeGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                    {
                        path: 'create',
                        component: CreateAccountPageComponent,
                        canActivate: [UserTypeGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                    {
                        path: 'view/:id',
                        component: ViewAccountPageComponent,
                        canActivate: [UserTypeGuard],

                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_account'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                    {
                        path: 'upload',
                        component: UploadAccountsPageComponent,
                        canActivate: [UserTypeGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.upload'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                ],
            },
            {
                path: 'account-relations',
                data: {
                    breadcrumb: i18next.t('breadcrumb.accountRelations'),
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: AccountRelationsPageComponent,
                        canActivate: [UserTypeGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                    {
                        path: 'create',
                        component: CreateAccountRelationPageComponent,
                        canActivate: [UserTypeGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                    {
                        path: 'view/:id',
                        component: ViewAccountRelationPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_account_relation'),
                            permissions: [PERMISSIONS.ViewAccountRelation],
                        },
                    },
                ],
            },
            {
                path: 'users',
                data: {
                    breadcrumb: i18next.t('breadcrumb.users'),
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: UsersPageComponent,
                        canActivate: [UserTypeGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                    {
                        path: 'create',
                        component: CreateUserPageComponent,
                        canActivate: [UserTypeGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                    {
                        path: 'view/:id',
                        component: ViewUserPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_user'),
                        },
                    },
                ],
            },
            {
                path: 'vehicles',
                data: {
                    breadcrumb: i18next.t('breadcrumb.vehicles'),
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: VehiclesPageComponent,
                        canActivate: [UserTypeGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                    },
                    {
                        path: 'create',
                        component: CreateVehiclePageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create'),
                            permissions: [PERMISSIONS.CreateVehicle],
                        },
                    },
                    {
                        path: 'view/:id',
                        component: ViewVehiclePageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_vehicle'),
                            permissions: [PERMISSIONS.ViewVehicle],
                        },
                    },
                    {
                        path: 'upload',
                        component: UploadVehiclesPageComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            breadcrumb: i18next.t('breadcrumb.upload'),
                            permissions: [PERMISSIONS.CreateVehicle],
                        },
                    },
                ],
            },
            {
                path: 'issuers',
                data: {
                    breadcrumb: i18next.t('breadcrumb.issuers'),
                    types: [UserType.Developer, UserType.Admin],
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: IssuersPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'create',
                        component: CreateIssuerPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create'),
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'view/:id',
                        component: ViewIssuerPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_issuer'),
                        },
                    },
                    {
                        path: 'upload',
                        component: UploadIssuersPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.upload'),
                            types: [UserType.Developer],
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },
            {
                path: 'reporting',
                data: {
                    breadcrumb: i18next.t('breadcrumb.reporting'),
                    types: [UserType.Developer, UserType.Admin],
                },
                children: [
                    {
                        path: '',
                        component: AdminReportsPageComponent,
                        data: {
                            breadcrumb: '',
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },
            {
                path: 'partial-infringement',
                data: {
                    breadcrumb: i18next.t('breadcrumb.partial_infringement'),
                    types: [UserType.Developer, UserType.Admin],
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: PartialInfringementPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'create',
                        component: CreatePartialInfringementPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'view/:id',
                        component: ViewPartialInfringementPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_partial_infringement'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'upload',
                        component: UploadPartialInfringementPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.upload_partial_infringement'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'fetch',
                        component: FetchPartialInfringementPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.fetch_partial_infringement'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },

                    {
                        path: 'upload-ocr',
                        component: UploadOcrPartialInfringementPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.upload_ocr_partial_infringement'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },
            {
                path: 'driver',
                data: {
                    breadcrumb: i18next.t('breadcrumb.driver'),
                    types: [UserType.Developer, UserType.Admin],
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: DriverPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'create',
                        component: CreateDriverPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'view/:id',
                        component: ViewDriverPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_driver'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'upload',
                        component: UploadDriverPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.upload_driver'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },
            {
                path: 'logs/integration-request',
                data: {
                    breadcrumb: i18next.t('breadcrumb.integration_request'),
                    types: [UserType.Developer, UserType.Admin],
                },
                children: [
                    {
                        path: '',
                        component: IntegrationRequestLogsPageComponent,
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: ':id',
                        component: ViewIntegrationRequestLogPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_integration_request'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },
            {
                path: 'logs/raw-infringement',
                data: {
                    breadcrumb: i18next.t('breadcrumb.raw_infringement'),
                    types: [UserType.Developer, UserType.Admin],
                },
                canActivate: [UserTypeGuard],
                children: [
                    {
                        path: '',
                        component: RawInfringementLogsPageComponent,
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: ':id',
                        component: ViewRawInfringementLogPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_raw_infringement'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },

            {
                path: 'logs/job',
                data: {
                    breadcrumb: i18next.t('breadcrumb.job'),
                    types: [UserType.Developer, UserType.Admin],
                },
                canActivate: [UserTypeGuard],
                children: [
                    {
                        path: '',
                        component: JobLogsPageComponent,
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: ':id',
                        component: ViewJobLogPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_job'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },
            {
                path: 'request-information-log',
                data: {
                    breadcrumb: i18next.t('breadcrumb.request_information'),
                    types: [UserType.Developer, UserType.Admin],
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: RequestInformationLogsPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'view/:id',
                        component: ViewRequestInformationLogPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_request_information'),
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },
            {
                path: 'infringements',
                data: {
                    breadcrumb: i18next.t('breadcrumb.infringements'),
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: InfringementsPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'create',
                        component: CreateInfringementPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'view/:id',
                        component: ViewInfringementPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view_infringement'),
                            permissions: [PERMISSIONS.ViewInfringement],
                        },
                        canActivate: [PermissionGuard],
                    },
                    {
                        path: 'upload',
                        component: UploadInfringementsPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.upload'),
                            permissions: [PERMISSIONS.CreateInfringement],
                        },
                        canActivate: [PermissionGuard],
                    },
                ],
            },
            {
                path: 'nominations/:id/redirect/municipal',
                component: MunicipallyRedirectNominationPageComponent,
                data: {
                    breadcrumb: i18next.t('breadcrumb.municipal-redirection'),
                },
            },
            {
                path: 'nominations/:id/redirect-by-mail/municipal',
                component: MunicipallyRedirectNominationPageComponent,
                data: {
                    breadcrumb: i18next.t('breadcrumb.municipal-redirection'),
                },
            },
            {
                path: 'contracts',
                data: {
                    breadcrumb: i18next.t('breadcrumb.vehicle_contracts'),
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full',
                    },
                    {
                        path: 'view',
                        component: ContractsPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.view'),
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [UserTypeGuard],
                    },
                    {
                        path: 'view/:id',
                        component: ViewContractPageComponent,
                        data: {
                            permissions: [PERMISSIONS.EditVehicles],
                            breadcrumb: i18next.t('breadcrumb.view_contract'),
                        },
                        canActivate: [PermissionGuard],
                    },
                    {
                        path: 'lease/upload',
                        component: UploadLeaseContractsPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.lease_upload'),
                            permissions: [PERMISSIONS.EditVehicles],
                        },
                        canActivate: [PermissionGuard],
                    },
                    {
                        path: 'ownership/upload',
                        component: UploadOwnershipContractsPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.ownership_upload'),
                            permissions: [PERMISSIONS.EditVehicles],
                        },
                        canActivate: [PermissionGuard],
                    },
                    {
                        path: 'driver/upload',
                        component: UploadDriverContractsPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.driver_upload'),
                            permissions: [PERMISSIONS.EditVehicles],
                        },
                        canActivate: [PermissionGuard],
                    },
                ],
            },
            {
                path: 'payments',
                data: {
                    breadcrumb: i18next.t('breadcrumb.payments'),
                },
                children: [
                    {
                        path: 'upload',
                        component: UploadPaymentsPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.payments_upload'),
                            permissions: [PERMISSIONS.PayInfringement],
                            types: [UserType.Developer, UserType.Admin],
                        },
                        canActivate: [PermissionGuard, UserTypeGuard],
                    },
                ],
            },
            {
                path: 'generated-documents',
                data: {
                    breadcrumb: i18next.t('breadcrumb.generated-documents'),
                },
                children: [
                    {
                        path: ':id/edit/:target/:targetId',
                        component: EditGeneratedDocumentPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.payments_upload'),
                        },
                    },
                ],
            },
            {
                path: 'documents',
                data: {
                    breadcrumb: i18next.t('breadcrumb.documents'),
                },
                children: [
                    {
                        path: 'upload/:target/:targetId',
                        component: CreateAndLinkDocumentPageComponent,
                        data: {
                            breadcrumb: i18next.t('breadcrumb.create_and_link'),
                        },
                    },
                ],
            },
            {
                path: 'integration-test',
                data: {
                    breadcrumb: i18next.t('breadcrumb.integration-test'),
                    types: [UserType.Developer, UserType.Admin],
                },
                children: [
                    {
                        path: '',
                        component: IntegrationTestPageComponent,
                        data: {
                            breadcrumb: '',
                        },
                        canActivate: [UserTypeGuard],
                    },
                ],
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
