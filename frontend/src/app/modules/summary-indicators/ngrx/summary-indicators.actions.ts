import { createAction, props } from '@ngrx/store';
import {
    ComparisonSummaryIndicatorData,
    ThisYearSummaryIndicatorData,
} from '@modules/summary-indicators/services/summary-indicators.service';
import { RequestAction } from '@modules/shared/models/ngrx/request.action';

export enum SummaryIndicatorTypes {
    InfringementCost = 'infringement-cost',
    ManagedVehicles = 'managed-vehicles',
    RedirectionInformation = 'redirection-information',
    UnmanagedVehicles = 'unmanaged-vehicles',
    None = 'none',
}

export const updateDateComparison = createAction('[Summary Indicators] Update Is Dates Comparison', props<{ isDateComparison: boolean }>());

export const clearSummaryIndicatorsData = createAction('[Summary Indicators] Clear Summary Indicators Data');

export const updatedInfringementView = createAction(
    '[Summary Indicators] Updated infringement view',
    props<{ viewInfringementTable: SummaryIndicatorTypes }>(),
);

export const hideInfringementView = createAction('[Summary Indicators] Hide infringement view');

export const requestThisYearSummaryIndicators = new RequestAction<ThisYearSummaryIndicatorData, any>(
    'SummaryIndicators',
    'This Years Summary Indicators Data',
);
export const requestComparisonSummaryIndicators = new RequestAction<ComparisonSummaryIndicatorData, any>(
    'SummaryIndicators',
    'Comparison Summary Indicators Data',
);
