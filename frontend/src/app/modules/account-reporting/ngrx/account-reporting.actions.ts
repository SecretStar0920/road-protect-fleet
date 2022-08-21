import { RequestAction } from '@modules/shared/models/ngrx/request.action';
import { MultiSeries, SingleSeries } from '@swimlane/ngx-charts';
import { MetabaseItemDetailsArray } from '@modules/shared/dtos/reporting-data.dto';

export const getAccountSummary = new RequestAction<SingleSeries, any>('AccountReporting', 'Account Summary');
export const getVehicleCounts = new RequestAction<SingleSeries, any>('AccountReporting', 'Vehicle counts');
export const getLeadingVehicles = new RequestAction<SingleSeries, any>('AccountReporting', 'Leading vehicles');
export const getInfringementCounts = new RequestAction<MultiSeries, any>('AccountReporting', 'Infringement counts');
export const getInfringementAmounts = new RequestAction<SingleSeries, any>('AccountReporting', 'Infringement amounts');
export const getMetabaseItemDetails = new RequestAction<MetabaseItemDetailsArray, any>('AccountReporting', 'Metabase details');
export const getMetabaseKPIDetails = new RequestAction<MetabaseItemDetailsArray, any>('AccountReporting', 'Metabase kpi details');
