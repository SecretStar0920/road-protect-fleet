import { createAction, props } from '@ngrx/store';
import { MultiSeries, SingleSeries } from '@swimlane/ngx-charts';

export const loadSummaryReportingAction = createAction('[Reporting] Load Summary Reporting', props<{ data: SingleSeries }>());

export const loadVehicleReportingAction = createAction('[Reporting] Load Vehicle Reporting', props<{ data: SingleSeries }>());

export const loadInfringementStatusReportingAction = createAction(
    '[Reporting] Load Infringement Status Reporting',
    props<{ data: SingleSeries }>(),
);

export const loadIssuerInfringementsReportingAction = createAction(
    '[Reporting] Load Issuer Infringements Reporting',
    props<{ data: MultiSeries }>(),
);

export const loadInfringementsDueReportingAction = createAction(
    '[Reporting] Load Infringement Due Reporting',
    props<{ data: MultiSeries }>(),
);
