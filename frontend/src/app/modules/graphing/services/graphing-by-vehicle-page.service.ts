import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, take, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import {
    graphingByVehiclePreviousYear,
    graphingByVehicle,
    graphingByVehicleMappedTableData,
    graphingByVehicleExclude,
    graphingByIssuerTotals,
    graphingByVehicleTotals,
} from '@modules/graphing/ngrx/graphing.actions';
import { Observable } from 'rxjs';
import {
    DateRangeDto,
    GraphingData,
    GraphingDataManipulationService,
    TableData,
} from '@modules/graphing/services/graphing-data-manipulation.service';
import {
    GeneralCompositeKeyData,
    GeneralMappedGraphingByData,
    GeneralRawGraphingByData,
} from '@modules/graphing/services/graphing-table.service';
import {
    GraphingDataDto,
    ReportingEndpoints,
} from '@modules/graphing/components/general-graphing-by-page/general-graphing-by-page.component';
import { isNil } from 'lodash';
import i18next from 'i18next';
import { byVehicleMappedTableData, byVehicleNumber, byVehicleTotals, dateRange, showOther } from '@modules/graphing/ngrx/graphing.selector';

@Injectable({
    providedIn: 'root',
})
export class GraphingByVehiclePageService {
    constructor(
        private http: HttpService,
        private store: Store<GraphingState>,
        private graphingDataManipulationService: GraphingDataManipulationService,
    ) {}

    getGraphingByVehicleData(dto: DateRangeDto, endpoint: ReportingEndpoints): Observable<GeneralRawGraphingByData[]> {
        const newDto: GraphingDataDto = { ...dto, endpoint };
        return this.http.postSecure(`graphing/by-vehicle`, newDto).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(GeneralRawGraphingByData, item));
                }
                return [];
            }),
            tap((data: any[]) => {
                this.store.dispatch(graphingByVehicle({ data, dto }));
            }),
        );
    }

    getGraphingByVehiclePreviousYearData(
        dto: DateRangeDto,
        numberOfYears: number,
        endpoint: ReportingEndpoints,
    ): Observable<GeneralRawGraphingByData[]> {
        const newDto: GraphingDataDto = { ...dto, endpoint };
        return this.http.postSecure(`graphing/by-vehicle`, newDto).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(GeneralRawGraphingByData, item));
                }
                return [];
            }),
            tap((data: any[]) => {
                this.store.dispatch(graphingByVehiclePreviousYear({ data, numberOfYears }));
            }),
        );
    }

    initialiseVehicleData(compositeObject: GeneralCompositeKeyData): GraphingData {
        let vehicleNumber: number;
        this.store.pipe(select(byVehicleNumber), take(1)).subscribe((result) => {
            if (!isNil(result)) {
                vehicleNumber = result;
            }
        });
        // Bar Chart
        const resultArray = [];
        Object.keys(compositeObject).forEach((key) => {
            // Only push the total values
            if (compositeObject[key].offenceDate === i18next.t('graphing-by.total_amount')) {
                resultArray.push(compositeObject[key]);
            }
        });
        const totalsArray = resultArray
            .sort((a, b) => {
                return b.sum - a.sum;
            })
            .slice();
        this.store.dispatch(graphingByVehicleTotals({ totalsArray }));

        // Table Data
        const tableArray = Object.keys(compositeObject).map((key) => {
            return compositeObject[key];
        });
        this.store.dispatch(graphingByVehicleMappedTableData({ data: tableArray }));

        return this.restrictNumberOfVehicles(vehicleNumber, tableArray, totalsArray);
    }

    restrictNumberOfVehicles(
        vehicleNumber: number,
        tableArray?: GeneralMappedGraphingByData[],
        totalsArray?: GeneralMappedGraphingByData[],
    ): GraphingData {
        let selectedDateRange: DateRangeDto;
        this.store.pipe(select(dateRange), take(1)).subscribe((dates) => {
            if (!isNil(dates)) {
                selectedDateRange = dates;
            }
        });
        if (!tableArray) {
            this.store.pipe(select(byVehicleMappedTableData), take(1)).subscribe((result) => {
                if (!isNil(result)) {
                    tableArray = result;
                }
            });
        }
        if (!totalsArray) {
            this.store.pipe(select(byVehicleTotals), take(1)).subscribe((result) => {
                if (!isNil(result)) {
                    totalsArray = result;
                }
            });
        }

        const totals = tableArray.filter((row) => row.offenceDate === i18next.t('graphing-by.total_amount'));
        const excludedVehicles = totals
            .sort((a, b) => b.sum - a.sum)
            .slice(vehicleNumber)
            .map((vehicleTotal) => vehicleTotal.registration);
        this.store.dispatch(graphingByVehicleExclude({ excludedVehicles }));

        // Bar Chart
        const barGraphData = this.graphingDataManipulationService.manipulateRawVehicleToNgXBarGraph(totalsArray.slice(0, vehicleNumber));
        // Table
        const tableData = this.vehicleTableData(tableArray, excludedVehicles);

        return { lineGraphData: undefined, barGraphData, tableData };
    }

    vehicleTableData(tableArray?: GeneralMappedGraphingByData[], excludedVehicles?: string[]): TableData {
        let resultArray: GeneralMappedGraphingByData[];
        if (!!tableArray) {
            resultArray = tableArray;
        } else {
            this.store.pipe(select(byVehicleMappedTableData), take(1)).subscribe((result) => {
                if (!isNil(result)) {
                    resultArray = result;
                }
            });
        }
        if (!!excludedVehicles) {
            resultArray = resultArray.filter((item) => {
                return !excludedVehicles.includes(item.registration);
            });
        }
        const columnKey = 'registration';

        const data = this.graphingDataManipulationService.manipulateRawToTableData(resultArray, columnKey);
        return { columns: data.columns, tableArray: data.manipulatedData };
    }
}
