import { RequestAction } from '@modules/shared/models/ngrx/request.action';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { HomeReportingDataDto } from '@modules/home/services/home-reporting.service';
import { createAction, props } from '@ngrx/store';

export const getHomeReportingData = new RequestAction<HomeReportingDataDto, DateRangeDto>('Home Reporting', 'Get Home Reporting Data');

export const setManipulatedData = createAction(`[Home Reporting] Setting manipulated data`, props<{ data: HomeReportingDataDto }>());
export const setHomeReportingDates = createAction(`[Home Reporting] Setting Home Reporting Dates`, props<{ dates: DateRangeDto }>());
