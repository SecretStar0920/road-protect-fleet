import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Store } from '@ngrx/store';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';
import { NgxDataPoint, NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';

export class GetSummaryIndicatorsDto {
    dateRange: SliderDateRangeDto;
    isDateComparison: boolean;
}
export class ThisYearSummaryIndicatorData {
    accountId: number;
    manipulatedManagedVehiclesData: NgxDataPoint[];
    manipulatedInfringementCostData: NgxDataPoint[];
    manipulatedRedirectionData: NgxDataPoint[];
    manipulatedUnmanagedVehiclesData: NgxDataPoint[];
}

export class ComparisonSummaryIndicatorData {
    accountId: number;
    manipulatedManagedVehiclesData: NgxSeriesData[];
    manipulatedInfringementCostData: NgxSeriesData[];
    manipulatedRedirectionData: NgxSeriesData[];
    manipulatedUnmanagedVehiclesData: NgxSeriesData[];
    comparisonDates: SliderDateRangeDto;
}

@Injectable({
    providedIn: 'root',
})
export class SummaryIndicatorsService {
    constructor(private http: HttpService, private store: Store<SummaryIndicatorsState>) {}
    getThisYearSummaryIndicators(dto: GetSummaryIndicatorsDto) {
        return this.http.postSecure('summary-indicators/this-year', dto);
    }

    getComparisonSummaryIndicators(dto: GetSummaryIndicatorsDto) {
        return this.http.postSecure('summary-indicators/year-comparison', dto);
    }
}
