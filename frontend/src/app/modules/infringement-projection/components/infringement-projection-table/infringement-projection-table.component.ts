import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { get, isNil } from 'lodash';
import i18next from 'i18next';
import * as moment from 'moment';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { getEndpoint, rawInfringementProjectionData } from '@modules/infringement-projection/ngrx/infringement-projection.selector';
import { InfringementProjectionState } from '@modules/infringement-projection/ngrx/infringement-projection.reducer';
import { InfringementProjectionDataManipulationService } from '@modules/infringement-projection/services/infringement-projection-data-manipulation.service';
import { DatePipe } from '@angular/common';
import { infringementNgrxHelper, InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import {
    InfringementPredictionEndpoints,
    RawInfringementPredictionWarnings,
} from '@modules/infringement-projection/services/infringement-projection.service';
import { vehicleNgrxHelper, VehicleState } from '@modules/vehicle/ngrx/vehicle.reducer';
import { resetInfringementQueryParameters } from '@modules/infringement/ngrx/infringement.actions';
import { resetVehicleQueryParams } from '@modules/vehicle/ngrx/vehicle.actions';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { mapTranslatedToInfringementStatus } from '@modules/graphing/services/map-translated-to-infringement-status.const';
import { GraphingParameters } from '@modules/graphing/ngrx/graphing.actions';

export class InfringementPredictionDataPoint {
    infringementCount: string;
    noContractCount: string;
    predicted: boolean;
    value: string;
    vehicleCount: string;
    vehicleCountTotal: string;
}

export class InfringementPredictionData {
    column: string;
    data: { [year: string]: InfringementPredictionDataPoint }[];
}

@Component({
    selector: 'rp-infringement-projection-table',
    templateUrl: './infringement-projection-table.component.html',
    styleUrls: ['./infringement-projection-table.component.less'],
    providers: [GeneralTableService],
})
export class InfringementProjectionTableComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    tableData: any[] = [];
    rowSpan = 2;
    scroll: { x: string; y?: string } = {
        x: '100%',
    };
    columnData: { title: string; key: string; subColumns?: { title: string; key: string }[] }[];
    templateColumns: { [key: string]: TemplateRef<any> } = {};
    selectedDates: { startDate: string; endDate: string };
    selectedStatusData: { status: string; count: number; cost: number }[] = [];
    selectedData: InfringementPredictionData;
    warningMessage: RawInfringementPredictionWarnings;
    @Output() viewInfringements: EventEmitter<boolean> = new EventEmitter();
    @Output() viewVehicles: EventEmitter<boolean> = new EventEmitter();
    endpoint: InfringementPredictionEndpoints;

    @ViewChild('monthColumnTemplate', { static: true }) monthColumnTemplate: TemplateRef<any>;
    @ViewChild('columnTemplate', { static: true }) columnTemplate: TemplateRef<any>;
    @ViewChild('infringementCountTemplate', { static: true }) infringementCountTemplate: TemplateRef<any>;
    @ViewChild('vehicleCountTemplate', { static: true }) vehicleCountTemplate: TemplateRef<any>;
    @ViewChild('valueTemplate', { static: true }) valueTemplate: TemplateRef<any>;

    constructor(
        private store: Store<InfringementProjectionState>,
        private infringementStore: Store<InfringementState>,
        private vehicleStore: Store<VehicleState>,
        private datePipe: DatePipe,
        private infringementProjectionDataManipulationService: InfringementProjectionDataManipulationService,
    ) {}

    async ngOnInit() {
        this.store.pipe(select(rawInfringementProjectionData), takeUntil(this.destroy$)).subscribe((rawDataDto) => {
            this.warningMessage = rawDataDto?.warning ? rawDataDto?.warning : null;
            if (!isNil(rawDataDto) && rawDataDto.data.length > 0) {
                const columnKey = 'offenceYear';
                const rowKey = 'offenceMonth';

                const manipulatedData = this.infringementProjectionDataManipulationService.manipulateRawToTableData(
                    rawDataDto.data,
                    columnKey,
                    rowKey,
                );
                const columns = manipulatedData.columns;
                this.tableData = manipulatedData.manipulatedData;

                this.columnData = [
                    { key: 'offenceMonth', title: i18next.t('infringement-projection.offence_month') },
                    ...columns.map((column) => {
                        // For every year, there is a sub-column with three properties with keys form column_subColumn or year_property
                        this.templateColumns[column + '_infringementCount'] = this.infringementCountTemplate;
                        this.templateColumns[column + '_vehicleCount'] = this.vehicleCountTemplate;
                        this.templateColumns[column + '_value'] = this.valueTemplate;
                        return {
                            key: column,
                            title: this.datePipe.transform(new Date(column), 'yyyy'),
                            subColumns: [
                                { key: column + '_infringementCount', title: i18next.t('infringement-projection.infringement_count') },
                                { key: column + '_vehicleCount', title: i18next.t('infringement-projection.vehicle_count') },
                                { key: column + '_value', title: i18next.t('infringement-projection.value') },
                            ],
                        };
                    }),
                ];
                this.templateColumns['offenceMonth'] = this.monthColumnTemplate;
            } else {
                // If there is no data, clear the table
                this.tableData = [];
                this.columnData = [];
            }
        });
        this.store.pipe(select(getEndpoint), takeUntil(this.destroy$)).subscribe((endpoint) => {
            this.endpoint = endpoint;
        });
    }
    getCellValue(key: string, data: any) {
        return get(data, key, '');
    }

    vehiclesHaveNoContracts(rawData): boolean {
        const noContracts = this.getData(rawData, 'noContractCount');
        return String(noContracts) === '0' || !noContracts;
    }

    isPredictedData(data): boolean {
        if (this.getData(data, 'predicted')) {
            return true;
        }
        // Checks if date is in after the start of this month, then data is predicted and not actual data
        return moment(`${data.data.offenceMonth} ${this.findSubColumnYear(data.column)}`).isSameOrAfter(moment().startOf('month'));
    }

    findSubColumnYear(columnName: string): string {
        // Based on format column_subColumn
        return columnName.split('_', 1)[0];
    }

    onViewInfringements(status?: string) {
        // Convert the endpoint to a via: eg owner to vehicleOwner
        let via = 'vehicle' + (this.endpoint[0].toUpperCase() + this.endpoint.slice(1));
        if (this.endpoint === InfringementPredictionEndpoints.Hybrid) {
            via = 'onVehicles';
        }
        const queryParameters: GraphingParameters = {
            issuers: [],
            endDate: this.selectedDates.endDate,
            graphing: true,
            via,
            infringementStatus: null,
            mine: true,
            startDate: this.selectedDates.startDate,
        };
        //    If the status is specified then map translated to the enum value
        if (!isNil(status)) {
            queryParameters.infringementStatus = mapTranslatedToInfringementStatus[status];
        }

        // Sets query params for infringements table
        this.store.dispatch(
            infringementNgrxHelper.setQueryParams({
                query: { ...queryParameters },
            }),
        );
        this.viewInfringements.emit(true);
    }

    onViewVehiclesWithContracts() {
        // Sets query params for infringements table
        this.store.dispatch(
            vehicleNgrxHelper.setQueryParams({
                query: {
                    graphing: true,
                    mine: true,
                    accountRole: this.endpoint,
                    via: 'infringementProjectionsContracts',
                    ...this.selectedDates,
                },
            }),
        );
        this.viewVehicles.emit(true);
    }

    onViewVehiclesWithInfringements() {
        // Sets query params for infringements table
        this.store.dispatch(
            vehicleNgrxHelper.setQueryParams({
                query: {
                    graphing: true,
                    accountRole: this.endpoint,
                    mine: true,
                    via: 'infringementProjectionsInfringements',
                    ...this.selectedDates,
                },
            }),
        );
        this.viewVehicles.emit(true);
    }

    onViewVehiclesWithoutInfringements() {
        // Sets query params for infringements table
        this.store.dispatch(
            vehicleNgrxHelper.setQueryParams({
                query: {
                    graphing: true,
                    accountRole: this.endpoint,
                    mine: true,
                    via: 'infringementProjectionsWithoutInfringements',
                    ...this.selectedDates,
                },
            }),
        );
        this.viewVehicles.emit(true);
    }

    onViewVehiclesNoContracts() {
        // Sets query params for infringements table
        this.store.dispatch(
            vehicleNgrxHelper.setQueryParams({
                query: {
                    graphing: true,
                    accountRole: this.endpoint,
                    mine: true,
                    via: 'infringementProjectionsNoContracts',
                    ...this.selectedDates,
                },
            }),
        );
        this.viewVehicles.emit(true);
    }

    calculatePercentage(vehicleCount, vehicleCountTotal) {
        if (vehicleCount === 0 || vehicleCountTotal === 0) {
            return '0 %';
        }
        return `${Math.round((vehicleCount / vehicleCountTotal) * 100)} %`;
    }

    getVehiclesWithoutInfringements(rawData: any) {
        return (
            Number(this.getData(rawData, 'vehicleCountTotal')) + // vehicles with contracts
            Number(this.getData(rawData, 'noContractCount')) - // vehicles without contracts
            Number(this.getData(rawData, 'vehicleCount')) // with infringements
        );
    }

    getData(rawData: any, dataType: string) {
        return rawData.data[this.findSubColumnYear(rawData.column)]?.[dataType];
    }

    getStatusData() {
        const yearData = this.selectedData.data[this.findSubColumnYear(this.selectedData.column)];
        this.selectedStatusData = [
            {
                status: i18next.t('infringement-status.' + InfringementStatus.Due),
                count: yearData.infringementCountDue,
                cost: yearData.valueDue,
            },
            {
                status: i18next.t('infringement-status.' + InfringementStatus.Outstanding),
                count: yearData.infringementCountOutstanding,
                cost: yearData.valueOutstanding,
            },
            {
                status: i18next.t('infringement-status.' + InfringementStatus.ApprovedForPayment),
                count: yearData.infringementCountApproved,
                cost: yearData.valueApproved,
            },
            {
                status: i18next.t('infringement-status.' + InfringementStatus.Paid),
                count: yearData.infringementCountPaid,
                cost: yearData.valuePaid,
            },
            {
                status: i18next.t('infringement-status.' + InfringementStatus.Closed),
                count: yearData.infringementCountClosed,
                cost: yearData.valueClosed,
            },
        ];
    }

    setSelectedCell(popoverShowing: boolean, data: any) {
        if (popoverShowing) {
            this.selectedDates = {
                startDate: moment(`${data.data.offenceMonth} ${this.findSubColumnYear(data.column)}`)
                    .startOf('month')
                    .toISOString(),
                endDate: moment(`${data.data.offenceMonth} ${this.findSubColumnYear(data.column)}`)
                    .endOf('month')
                    .toISOString(),
            };
            this.selectedData = data;
            this.getStatusData();
        }
    }

    ngOnDestroy(): void {
        this.infringementStore.dispatch(resetInfringementQueryParameters());
        this.vehicleStore.dispatch(resetVehicleQueryParams());
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
