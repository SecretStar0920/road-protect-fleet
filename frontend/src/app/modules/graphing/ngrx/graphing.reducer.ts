import { createReducer, on } from '@ngrx/store';
import {
    graphingByIssuer,
    graphingByVehicle,
    graphingByVehicleMappedData,
    graphingByStatusMappedData,
    graphingByIssuerMappedData,
    graphingByIssuerPreviousYear,
    graphingByIssuerPreviousYearMappedData,
    graphingByVehiclePreviousYear,
    graphingByVehiclePreviousYearMappedData,
    graphingByStatusPreviousYear,
    graphingByStatusPreviousYearMappedData,
    graphingByStatus,
    setGraphingByDate,
    resetGraphingByDate,
    loadComparison,
    resolveComparison,
    loadGraph,
    resolveGraph,
    resetComparisonLoad,
    resetGraphLoad,
    GraphingParameters,
    graphingSelectedParameters,
    showPreviousYearComparison,
    resetInfringementViewTrigger,
    setReportingEndpoint,
    graphingByIssuerTotals,
    graphingByIssuerNumber,
    graphingByIssuerExclude,
    graphingByIssuerTranslatedData,
    graphingByIssuerGraphData,
    graphingByIssuerMappedTableData,
    setShowOther,
    graphingByIssuerUpdateGraphData,
    byIssuerOtherIssuersPerDateRange,
    graphingByVehicleGraphData,
    graphingByVehicleMappedTableData,
    graphingByVehicleExclude,
    graphingByVehicleNumber,
    graphingByVehicleTotals,
} from '@modules/graphing/ngrx/graphing.actions';
import { DateRangeDto, TableData } from '@modules/graphing/services/graphing-data-manipulation.service';
import {
    GeneralCompositeKeyData,
    GeneralMappedGraphingByData,
    GeneralRawGraphingByData,
} from '@modules/graphing/services/graphing-table.service';
import * as moment from 'moment';
import { ReportingEndpoints } from '@modules/graphing/components/general-graphing-by-page/general-graphing-by-page.component';
import { NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';

export interface GraphingState {
    byStatus: GeneralRawGraphingByData[];
    byVehicle: GeneralRawGraphingByData[];
    byIssuerMappedData: GeneralCompositeKeyData;
    byVehicleMappedData: GeneralCompositeKeyData;
    byStatusMappedData: GeneralCompositeKeyData;
    isComparisonLoading: number;
    isGraphLoading: number;
    showPreviousYearComparison: boolean;
    byIssuerPreviousYear: { [key: number]: GeneralRawGraphingByData[] };
    byIssuerPreviousYearMappedData: { [key: number]: GeneralCompositeKeyData };
    byVehiclePreviousYear: { [key: number]: GeneralRawGraphingByData[] };
    byVehiclePreviousYearMappedData: { [key: number]: GeneralCompositeKeyData };
    byStatusPreviousYear: { [key: number]: GeneralRawGraphingByData[] };
    byStatusPreviousYearMappedData: { [key: number]: GeneralCompositeKeyData };
    dateRange: DateRangeDto;
    selectedParameters: GraphingParameters;
    triggerInfringementViewCount: number;
    byIssuerUniqueKeys: number;
    byVehicleUniqueKeys: number;
    selectedEndpoint: ReportingEndpoints;
    issuerLineGraphData: NgxSeriesData[];
    issuerBarGraphData: NgxSeriesData[];
    vehicleBarGraphData: NgxSeriesData[];
    issuerTableData: TableData;
    vehicleTableData: TableData;
    otherIssuerLineGraphData: NgxSeriesData[];
    otherIssuerBarGraphData: NgxSeriesData[];
    otherIssuerTableData: TableData;
    issuerMappedTableData: GeneralMappedGraphingByData[];
    vehicleMappedTableData: GeneralMappedGraphingByData[];
    showOther: boolean;
    groupedIssuers: number;
    vehicleNumber: number;
    issuersToExclude: string[];
    vehiclesToExclude: string[];
    otherIssuersPerDateRange: { [selectionDate: string]: string[] };
    translatedData: GeneralMappedGraphingByData[];
    vehicleTotals: GeneralMappedGraphingByData[];
    issuerTotals: { [key: string]: { name: string; total: number } };
}

export const initialGraphingState: GraphingState = {
    byStatus: undefined,
    byIssuerUniqueKeys: undefined,
    byVehicleUniqueKeys: undefined,
    byVehicle: undefined,
    byIssuerMappedData: undefined,
    byVehicleMappedData: undefined,
    byStatusMappedData: undefined,
    showPreviousYearComparison: false,
    byIssuerPreviousYear: undefined,
    byIssuerPreviousYearMappedData: undefined,
    byVehiclePreviousYear: undefined,
    byVehiclePreviousYearMappedData: undefined,
    byStatusPreviousYear: undefined,
    byStatusPreviousYearMappedData: undefined,
    dateRange: {
        startDate: moment().startOf('year').toISOString(),
        endDate: moment().endOf('year').toISOString(),
    },
    isComparisonLoading: 0,
    isGraphLoading: 0,
    selectedParameters: undefined,
    issuerLineGraphData: undefined,
    issuerBarGraphData: undefined,
    vehicleBarGraphData: undefined,
    issuerTableData: undefined,
    vehicleTableData: undefined,
    otherIssuerLineGraphData: undefined,
    otherIssuerBarGraphData: undefined,
    otherIssuerTableData: undefined,
    issuerMappedTableData: undefined,
    vehicleMappedTableData: undefined,
    issuerTotals: undefined,
    showOther: false,
    groupedIssuers: 5,
    vehicleNumber: 10,
    issuersToExclude: [],
    vehiclesToExclude: [],
    translatedData: undefined,
    vehicleTotals: undefined,
    otherIssuersPerDateRange: undefined,
    triggerInfringementViewCount: 0,
    selectedEndpoint: ReportingEndpoints.All,
};

export const graphingReducer = createReducer(
    initialGraphingState,
    on(setGraphingByDate, (state, action) => {
        return {
            ...state,
            dateRange: action.dates,
        };
    }),
    on(resetGraphingByDate, (state, action) => {
        return {
            ...state,
            dateRange: initialGraphingState.dateRange,
        };
    }),
    on(loadComparison, (state, action) => {
        return {
            ...state,
            isComparisonLoading: state.isComparisonLoading + 1,
        };
    }),
    on(resolveComparison, (state, action) => {
        return {
            ...state,
            isComparisonLoading: state.isComparisonLoading - 1,
        };
    }),
    on(setReportingEndpoint, (state, action) => {
        return {
            ...state,
            selectedEndpoint: action.endpoint,
        };
    }),
    on(loadGraph, (state, action) => {
        return {
            ...state,
            isGraphLoading: state.isGraphLoading + 1,
        };
    }),
    on(resolveGraph, (state, action) => {
        return {
            ...state,
            isGraphLoading: state.isGraphLoading - 1,
        };
    }),
    on(resetComparisonLoad, (state, action) => {
        return {
            ...state,
            isGraphLoading: 0,
        };
    }),
    on(resetGraphLoad, (state, action) => {
        return {
            ...state,
            isGraphLoading: 0,
        };
    }),
    on(graphingByStatus, (state, action) => {
        return {
            ...state,
            byStatus: action.data,
            dateRange: action.dto,
        };
    }),
    on(graphingByIssuer, (state, action) => {
        return {
            ...state,
            byIssuer: action.data,
            dateRange: action.dto,
        };
    }),
    on(graphingByVehicle, (state, action) => {
        return {
            ...state,
            byVehicle: action.data,
            dateRange: action.dto,
        };
    }),
    on(graphingByVehicleMappedData, (state, action) => {
        return {
            ...state,
            byVehicleMappedData: action.compositeObject,
            byVehicleUniqueKeys: action.uniqueKeys,
        };
    }),
    on(graphingByStatusMappedData, (state, action) => {
        return {
            ...state,
            byStatusMappedData: action.data,
        };
    }),
    on(graphingByStatusPreviousYear, (state, action) => {
        return {
            ...state,
            byStatusPreviousYear: { ...state.byStatusPreviousYear, [action.numberOfYears]: action.data },
        };
    }),
    on(graphingByStatusPreviousYearMappedData, (state, action) => {
        return {
            ...state,
            byStatusPreviousYearMappedData: { ...state.byStatusPreviousYearMappedData, [action.numberOfYears]: action.data },
        };
    }),
    on(graphingByIssuerMappedData, (state, action) => {
        return {
            ...state,
            byIssuerMappedData: action.compositeObject,
            byIssuerUniqueKeys: action.uniqueKeys,
        };
    }),
    on(graphingByIssuerGraphData, (state, action) => {
        return {
            ...state,
            issuerLineGraphData: action.lineGraphData,
            issuerBarGraphData: action.barGraphData,
            issuerTableData: action.tableData,
            otherIssuerLineGraphData: action.otherLineGraphData,
            otherIssuerBarGraphData: action.otherBarGraphData,
            otherIssuerTableData: action.otherTableData,
        };
    }),
    on(graphingByVehicleGraphData, (state, action) => {
        return {
            ...state,
            vehicleTableData: action.tableData,
            vehicleBarGraphData: action.barGraphData,
        };
    }),
    on(graphingByIssuerUpdateGraphData, (state, action) => {
        return {
            ...state,
            issuerLineGraphData: action.lineGraphData,
            issuerBarGraphData: action.barGraphData,
            issuerTableData: action.tableData,
        };
    }),
    on(setShowOther, (state, action) => {
        return {
            ...state,
            showOther: action.showOther,
        };
    }),
    on(graphingByIssuerTotals, (state, action) => {
        return {
            ...state,
            issuerTotals: action.issuerTotals,
        };
    }),
    on(graphingByVehicleTotals, (state, action) => {
        return {
            ...state,
            vehicleTotals: action.totalsArray,
        };
    }),
    on(graphingByIssuerNumber, (state, action) => {
        return {
            ...state,
            groupedIssuers: action.groupedIssuers,
        };
    }),
    on(graphingByVehicleNumber, (state, action) => {
        return {
            ...state,
            vehicleNumber: action.groupedVehicles,
        };
    }),
    on(graphingByIssuerExclude, (state, action) => {
        return {
            ...state,
            issuersToExclude: action.issuersToExclude,
        };
    }),
    on(graphingByVehicleExclude, (state, action) => {
        return {
            ...state,
            vehiclesToExclude: action.excludedVehicles,
        };
    }),
    on(graphingByIssuerMappedTableData, (state, action) => {
        return {
            ...state,
            issuerMappedTableData: action.data,
        };
    }),
    on(graphingByVehicleMappedTableData, (state, action) => {
        return {
            ...state,
            vehicleMappedTableData: action.data,
        };
    }),
    on(graphingByIssuerTranslatedData, (state, action) => {
        return {
            ...state,
            translatedData: action.translatedData,
        };
    }),
    on(byIssuerOtherIssuersPerDateRange, (state, action) => {
        return {
            ...state,
            otherIssuersPerDateRange: action.otherIssuersPerDateRange,
        };
    }),
    on(graphingByIssuerPreviousYear, (state, action) => {
        return {
            ...state,
            byIssuerPreviousYear: { ...state.byIssuerPreviousYear, [action.numberOfYears]: action.data },
        };
    }),
    on(graphingByIssuerPreviousYearMappedData, (state, action) => {
        return {
            ...state,
            byIssuerPreviousYearMappedData: { ...state.byIssuerPreviousYearMappedData, [action.numberOfYears]: action.data },
        };
    }),
    on(graphingByVehiclePreviousYear, (state, action) => {
        return {
            ...state,
            byVehiclePreviousYear: { ...state.byVehiclePreviousYear, [action.numberOfYears]: action.data },
        };
    }),
    on(graphingByVehiclePreviousYearMappedData, (state, action) => {
        return {
            ...state,
            byVehiclePreviousYearMappedData: { ...state.byVehiclePreviousYearMappedData, [action.numberOfYears]: action.data },
        };
    }),
    on(showPreviousYearComparison, (state, action) => {
        if (action.data) {
            return {
                ...state,
                showPreviousYearComparison: action.data,
            };
        } else {
            return {
                ...state,
                byIssuerPreviousYearMappedData: null,
                showPreviousYearComparison: action.data,
            };
        }
    }),
    on(graphingSelectedParameters, (state, action) => {
        return {
            ...state,
            selectedParameters: action.data,
            triggerInfringementViewCount: action.triggerView ? state.triggerInfringementViewCount + 1 : state.triggerInfringementViewCount,
        };
    }),
    on(resetInfringementViewTrigger, (state, action) => {
        return {
            ...state,
            triggerInfringementViewCount: 0,
        };
    }),
);

export function reducer(state = initialGraphingState, action): GraphingState {
    return graphingReducer(state, action);
}
