import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

export class SliderDateRangeDto {
    startDate?: string;
    endDate?: string;
}

@Component({
    selector: 'rp-general-year-range-slider',
    templateUrl: './general-year-range-slider.component.html',
    styleUrls: ['./general-year-range-slider.component.less'],
})
export class GeneralYearRangeSliderComponent implements OnInit {
    @Output() updatedDateRange: EventEmitter<SliderDateRangeDto> = new EventEmitter();
    yearsComparisonSliderRange: { min: number; max: number };
    yearRange: number[];

    ngOnInit() {
        // Initialise slider
        const thisYear = Number(moment().year().toString());
        const twoYearsAgo = Number(moment().subtract(2, 'year').year().toString());
        const fiveYearsAgo = Number(moment().subtract(5, 'year').year().toString());
        this.yearsComparisonSliderRange = { min: Number(fiveYearsAgo), max: Number(thisYear) };
        this.yearRange = [twoYearsAgo, thisYear];
        this.onChangeYears();
    }

    onChangeYears() {
        const dto: SliderDateRangeDto = {
            startDate: moment(this.yearRange[0], 'YYYY').startOf('year').toISOString(),
            endDate: moment(this.yearRange[1], 'YYYY').endOf('year').toISOString(),
        };
        this.updatedDateRange.emit(dto);
    }
}
