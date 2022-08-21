import { createAction, props } from '@ngrx/store';
import { AllGraphingData, DateRangeDto, GraphingData } from '@modules/graphing/services/graphing-data-manipulation.service';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { GeneralCompositeKeyData, GeneralRawGraphingByData } from '@modules/graphing/services/graphing-table.service';
import { ReportingEndpoints } from '@modules/graphing/components/general-graphing-by-page/general-graphing-by-page.component';

export class GraphingParameters {
    issuers: string[];
    startDate: string;
    endDate: string;
    graphing: boolean;
    via?: string;
    mine?: boolean = true;
    vehicleRegistration?: string = null;
    infringementStatus?: InfringementStatus = null;
}

export const setGraphingByDate = createAction('[Graphing] Setting graphing by date', props<{ dates: DateRangeDto }>());
export const setReportingEndpoint = createAction('[Graphing] Setting graphing by endpoint', props<{ endpoint: ReportingEndpoints }>());
export const resetGraphingByDate = createAction('[Graphing] Resetting graphing by date');
export const setShowOther = createAction('[Graphing] Setting show others', props<{ showOther: boolean }>());

export const loadComparison = createAction('[Graphing] Loading Comparison');
export const resolveComparison = createAction('[Graphing] Resolving Comparison Load');
export const resetComparisonLoad = createAction('[Graphing] Resetting Comparison Load');

export const loadGraph = createAction('[Graphing] Loading Graph');
export const resolveGraph = createAction('[Graphing] Resolving Graph Load');
export const resetGraphLoad = createAction('[Graphing] Resetting Graph Load');

export const graphingByStatus = createAction(
    '[Graphing] Graphing by Infringement Status',
    props<{ data: GeneralRawGraphingByData[]; dto: DateRangeDto }>(),
);

export const graphingByIssuer = createAction(
    '[Graphing] Graphing by Issuer Name',
    props<{ data: GeneralRawGraphingByData[]; dto: DateRangeDto }>(),
);

export const graphingByVehicle = createAction(
    '[Graphing] Graphing by Vehicle Registration',
    props<{ data: GeneralRawGraphingByData[]; dto: DateRangeDto }>(),
);

export const graphingByIssuerMappedData = createAction(
    '[Graphing] Graphing by Issuer mapped data',
    props<{
        compositeObject: GeneralCompositeKeyData;
        uniqueKeys: number;
    }>(),
);

export const graphingByIssuerGraphData = createAction('[Graphing] Graphing by Issuer data', props<AllGraphingData>());
export const graphingByIssuerUpdateGraphData = createAction('[Graphing] Graphing by Issuer Update data', props<GraphingData>());
export const graphingByIssuerTotals = createAction(
    '[Graphing] Graphing by Issuer totals data',
    props<{ issuerTotals: { [key: string]: { name: string; total: number } } }>(),
);
export const graphingByVehicleTotals = createAction('[Graphing] Graphing by Vehicle totals data', props<{ totalsArray: any }>());
export const graphingByIssuerNumber = createAction('[Graphing] Graphing by Issuer number of Issuers', props<{ groupedIssuers: number }>());
export const graphingByVehicleNumber = createAction(
    '[Graphing] Graphing by Vehicle number of Vehicles',
    props<{ groupedVehicles: number }>(),
);
export const graphingByIssuerExclude = createAction(
    '[Graphing] Graphing by Issuer Issuers to exclude',
    props<{ issuersToExclude: string[] }>(),
);
export const graphingByVehicleExclude = createAction('[Graphing] Graphing by Vehicle to exclude', props<{ excludedVehicles: string[] }>());
export const byIssuerOtherIssuersPerDateRange = createAction(
    '[Graphing] Setting other issuers for bar graph',
    props<{ otherIssuersPerDateRange: { [selectionDate: string]: string[] } }>(),
);
export const graphingByIssuerTranslatedData = createAction(
    '[Graphing] Graphing by Issuer translated data',
    props<{ translatedData: any }>(),
);
export const graphingByIssuerMappedTableData = createAction('[Graphing] Graphing by Issuer Mapped Table Data', props<{ data: any }>());
export const graphingByVehicleMappedTableData = createAction('[Graphing] Graphing by Vehicle Mapped Table Data', props<{ data: any }>());

export const graphingByVehicleGraphData = createAction('[Graphing] Graphing by Vehicle data', props<GraphingData>());
export const graphingByVehicleMappedData = createAction(
    '[Graphing] Graphing by Vehicle mapped data',
    props<{
        compositeObject: GeneralCompositeKeyData;
        uniqueKeys: number;
    }>(),
);
export const graphingByStatusMappedData = createAction(
    '[Graphing] Graphing by Status mapped data',
    props<{ data: GeneralCompositeKeyData }>(),
);

export const graphingByIssuerPreviousYear = createAction(
    '[Graphing] Graphing by Issuer Name Previous Year',
    props<{ data: GeneralRawGraphingByData[]; numberOfYears: number }>(),
);

export const graphingByVehiclePreviousYear = createAction(
    '[Graphing] Graphing by Vehicle Previous Year',
    props<{ data: GeneralRawGraphingByData[]; numberOfYears: number }>(),
);

export const graphingByVehiclePreviousYearMappedData = createAction(
    '[Graphing] Graphing by Vehicle data previous year',
    props<{ data: GeneralCompositeKeyData; numberOfYears: number }>(),
);

export const graphingByStatusPreviousYear = createAction(
    '[Graphing] Graphing by Status Previous Year',
    props<{ data: GeneralRawGraphingByData[]; numberOfYears: number }>(),
);

export const graphingByStatusPreviousYearMappedData = createAction(
    '[Graphing] Graphing by Status data previous year',
    props<{ data: GeneralCompositeKeyData; numberOfYears: number }>(),
);

export const showPreviousYearComparison = createAction('[Graphing] Show comparison to previous year', props<{ data: boolean }>());

export const graphingByIssuerPreviousYearMappedData = createAction(
    '[Graphing] Graphing by Issuer mapped data previous year',
    props<{ data: GeneralCompositeKeyData; numberOfYears: number }>(),
);

export const graphingSelectedParameters = createAction(
    '[Graphing] Parameters selected on graph',
    props<{ data: GraphingParameters; triggerView?: boolean }>(),
);

export const resetInfringementViewTrigger = createAction('[Graphing] Resetting infringement view trigger');
