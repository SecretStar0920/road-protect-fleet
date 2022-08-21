import { NgModule } from '@angular/core';
import { AccountDropdownComponent } from '@modules/account/components/account-dropdown/account-dropdown.component';
import { AccountTagComponent } from '@modules/account/components/account-tag/account-tag.component';
import { CreateAccountComponent } from '@modules/account/components/create-account/create-account.component';
import { ContractStatusTagComponent } from '@modules/contract/components/contract-status-tag/contract-status-tag.component';
import { DeleteDocumentComponent } from '@modules/document/components/delete-document/delete-document.component';
import { ViewDocumentComponent } from '@modules/document/components/view-document/view-document.component';
import { InfringementStatusTagComponent } from '@modules/infringement/components/infringement-status-tag/infringement-status-tag.component';
import { InfringementTagComponent } from '@modules/infringement/components/infringement-tag/infringement-tag.component';
import { IssuerDropdownComponent } from '@modules/issuer/components/issuer-dropdown/issuer-dropdown.component';
import { IssuerTagComponent } from '@modules/issuer/components/issuer-tag/issuer-tag.component';
import { ViewShortLocationComponent } from '@modules/location/components/view-short-location/view-short-location.component';
import { MinimalSharedModule } from '@modules/minimal-shared/minimal-shared.module';
import { NominationStatusTagComponent } from '@modules/nomination/components/nomination-status-tag/nomination-status-tag.component';
import { RoleDropdownComponent } from '@modules/role/components/role-dropdown/role-dropdown.component';
import { AdvancedFilterTableComponent } from '@modules/shared/components/advanced-table/advanced-filter-table/advanced-filter-table.component';
import { BasicQueryBuilderComponent } from '@modules/shared/components/advanced-table/query-builder/basic-query-builder/basic-query-builder.component';
import { SimpleQueryBuilderComponent } from '@modules/shared/components/advanced-table/query-builder/simple-query-builder/simple-query-builder.component';
import { GeneralAutocompleteInputComponent } from '@modules/shared/components/general-autocomplete-input/general-autocomplete-input.component';
import { GeneralBetweenInputComponent } from '@modules/shared/components/general-between-input/general-between-input.component';
import { GeneralFormErrorDisplayComponent } from '@modules/shared/components/general-form-error-display/general-form-error-display.component';
import { GeneralImageDataObjectInputComponent } from '@modules/shared/components/general-image-data-object-input/general-image-data-object-input.component';
import { GeneralChartContainerComponent } from '@modules/shared/components/graphs/general-chart-container/general-chart-container.component';
import { HasPermissionDirective } from '@modules/shared/directives/has-permission.directive';
import { ShowDirective } from '@modules/shared/directives/show.directive';
import { SentenceCasePipe } from '@modules/shared/pipes/sentence-case.pipe';
import { XmlPipe } from '@modules/shared/pipes/xml.pipe';
import { StreetAddressAutocompleteComponent } from '@modules/street/components/street-address-autocomplete/street-address-autocomplete.component';
import { VehicleTagComponent } from '@modules/vehicle/components/vehicle-tag/vehicle-tag.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { GeneralSortComponent } from './components/advanced-table/general-sort/general-sort.component';
import { AdvancedQueryBuilderComponent } from './components/advanced-table/query-builder/general-query-builder/advanced-query-builder.component';
import { ExcelColumnMapperComponent } from './components/excel-column-mapper/excel-column-mapper.component';
import { GeneralBreadcrumbComponent } from './components/general-breadcrumb/general-breadcrumb.component';
import { GeneralCurrencyDisplayComponent } from './components/general-currency-display/general-currency-display.component';
import { GeneralDateRangeInputComponent } from './components/general-date-range-input/general-date-range-input.component';
import { GeneralEntitySpreadsheetUploadComponent } from './components/general-entity-spreadsheet-upload/general-entity-spreadsheet-upload.component';
import { GeneralFileUploadComponent } from './components/general-file-upload/general-file-upload.component';
import { GeneralFormDropdownComponent } from './components/general-form-dropdown/general-form-dropdown.component';
import { GeneralFormErrorsDisplayComponent } from './components/general-form-errors-display/general-form-errors-display.component';
import { GeneralObjectDisplayComponent } from './components/general-object-display/general-object-display.component';
import { GeneralPageComponent } from './components/general-page/general-page.component';
import { GeneralSignatureInputComponent } from './components/general-signature-input/general-signature-input.component';
import { GeneralSpreadsheetUploadComponent } from './components/general-spreadsheet-upload/general-spreadsheet-upload.component';
import { GeneralStateModelAlertComponent } from './components/general-state-model-alert/general-state-model-alert.component';
import { GeneralStepperComponent } from './components/general-stepper/general-stepper.component';
import { GeneralTableExportComponent } from './components/general-table/general-table-export/general-table-export.component';
import { GeneralTableComponent } from './components/general-table/general-table.component';
import { GeneralTimeDisplayComponent } from './components/general-time-display/general-time-display.component';
import { PageSectionComponent } from './components/page-section/page-section.component';
import { HideDirective } from './directives/hide.directive';
import { IsUserTypeDirective } from './directives/is-user-type.directive';
import { LetDirective } from './directives/let.directive';
import { TruncatePipe } from './pipes/truncate.pipe';
import { JsonComponent } from './components/json/json.component';
import { CookieService } from 'ngx-cookie-service';
import { IssuersDropdownComponent } from '@modules/issuer/components/issuers-dropdown/issuers-dropdown.component';
import { GeneralBooleanDisplayComponent } from './components/general-boolean-display/general-boolean-display.component';
import { IssuerProvidersDropdownComponent } from '@modules/issuer/components/issuer-providers-dropdown/issuer-providers-dropdown.component';
import { BrnAccountTagComponent } from '@modules/account/components/brn-account-tag/brn-account-tag.component';
import { GeneralGraphingComponent } from '@modules/shared/components/general-graphing/general-graphing.component';
import { GeneralYearRangeSliderComponent } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';
import { ManagePresetsModalComponent } from '@modules/shared/components/advanced-table/query-builder/basic-query-builder/components/manage-presets-modal/manage-presets-modal.component';
import { EditPresetModalComponent } from '@modules/shared/components/advanced-table/query-builder/basic-query-builder/components/edit-preset-modal/edit-preset-modal.component';
import { UserPresetsModule } from '@modules/shared/components/advanced-table/user-presets/user-presets.module';

@NgModule({
    declarations: [
        GeneralTableComponent,
        GeneralTableExportComponent,
        GeneralPageComponent,
        IsUserTypeDirective,
        HasPermissionDirective,
        AccountDropdownComponent,
        IssuerDropdownComponent,
        IssuerProvidersDropdownComponent,
        IssuersDropdownComponent,
        RoleDropdownComponent,
        ExcelColumnMapperComponent,
        GeneralFileUploadComponent,
        GeneralSpreadsheetUploadComponent,
        GeneralStepperComponent,
        HideDirective,
        ShowDirective,
        GeneralTimeDisplayComponent,
        GeneralFormDropdownComponent,
        CreateAccountComponent,
        GeneralChartContainerComponent,
        GeneralObjectDisplayComponent,
        InfringementStatusTagComponent,
        NominationStatusTagComponent,
        AdvancedQueryBuilderComponent,
        SimpleQueryBuilderComponent,
        AdvancedFilterTableComponent,
        GeneralFormErrorsDisplayComponent,
        IssuerTagComponent,
        VehicleTagComponent,
        AccountTagComponent,
        BrnAccountTagComponent,
        ContractStatusTagComponent,
        InfringementTagComponent,
        ViewShortLocationComponent,
        TruncatePipe,
        LetDirective,
        GeneralEntitySpreadsheetUploadComponent,
        DeleteDocumentComponent,
        ViewDocumentComponent,
        GeneralDateRangeInputComponent,
        GeneralCurrencyDisplayComponent,
        GeneralStateModelAlertComponent,
        GeneralSignatureInputComponent,
        GeneralImageDataObjectInputComponent,
        GeneralBreadcrumbComponent,
        BasicQueryBuilderComponent,
        EditPresetModalComponent,
        ManagePresetsModalComponent,
        GeneralBetweenInputComponent,
        GeneralAutocompleteInputComponent,
        PageSectionComponent,
        GeneralSortComponent,
        GeneralFormErrorDisplayComponent,
        SentenceCasePipe,
        StreetAddressAutocompleteComponent,
        JsonComponent,
        XmlPipe,
        GeneralBooleanDisplayComponent,
        GeneralGraphingComponent,
        GeneralYearRangeSliderComponent,
    ],
    imports: [MinimalSharedModule, UserPresetsModule, FileUploadModule, NgxChartsModule],
    providers: [CookieService],
    exports: [
        MinimalSharedModule,
        GeneralTableComponent,
        GeneralPageComponent,
        IsUserTypeDirective,
        AccountDropdownComponent,
        IssuerDropdownComponent,
        IssuerProvidersDropdownComponent,
        IssuersDropdownComponent,
        RoleDropdownComponent,
        ExcelColumnMapperComponent,
        GeneralFileUploadComponent,
        GeneralSpreadsheetUploadComponent,
        GeneralStepperComponent,
        HideDirective,
        ShowDirective,
        LetDirective,
        HasPermissionDirective,
        GeneralTimeDisplayComponent,
        CreateAccountComponent,
        NgxChartsModule,
        GeneralChartContainerComponent,
        GeneralObjectDisplayComponent,
        TruncatePipe,
        InfringementStatusTagComponent,
        NominationStatusTagComponent,
        AdvancedQueryBuilderComponent,
        SimpleQueryBuilderComponent,
        AdvancedFilterTableComponent,
        GeneralFormErrorsDisplayComponent,
        IssuerTagComponent,
        VehicleTagComponent,
        AccountTagComponent,
        BrnAccountTagComponent,
        InfringementTagComponent,
        ViewShortLocationComponent,
        ContractStatusTagComponent,
        GeneralEntitySpreadsheetUploadComponent,
        DeleteDocumentComponent,
        ViewDocumentComponent,
        GeneralDateRangeInputComponent,
        GeneralCurrencyDisplayComponent,
        GeneralStateModelAlertComponent,
        GeneralSignatureInputComponent,
        GeneralImageDataObjectInputComponent,
        BasicQueryBuilderComponent,
        GeneralBetweenInputComponent,
        GeneralAutocompleteInputComponent,
        PageSectionComponent,
        GeneralFormErrorDisplayComponent,
        SentenceCasePipe,
        StreetAddressAutocompleteComponent,
        JsonComponent,
        XmlPipe,
        GeneralBooleanDisplayComponent,
        GeneralGraphingComponent,
        GeneralYearRangeSliderComponent,
    ],
})
export class SharedModule {}
