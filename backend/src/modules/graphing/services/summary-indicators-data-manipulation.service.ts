import { isNil } from 'lodash';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { Injectable } from '@nestjs/common';

export class NgxDataPoint {
    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    @IsNumber()
    value: number;
}

export class NgxSeriesData {
    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    series: NgxDataPoint[];
}

class SummaryIndicatorsGeneralRawDataDto {
    year: number;
    [key: string]: any;
}
class SummaryIndicatorsByStatusRawDataDto extends SummaryIndicatorsGeneralRawDataDto {
    status: any;
    count: any;
}

@Injectable()
export class SummaryIndicatorsDataManipulationService {
    constructor() {}

    manipulateRawToYearComparisonData(rawData: SummaryIndicatorsGeneralRawDataDto[], keysToIgnore?: string[]): NgxSeriesData[] {
        if (rawData.length < 1) {
            return;
        }
        if (isNil(keysToIgnore)) {
            keysToIgnore = ['year'];
        }
        const seriesData: NgxSeriesData[] = [];
        const years = rawData.map((data) => data['year']);
        Object.keys(rawData[0]).forEach((key) => {
            if (!keysToIgnore.includes(key)) {
                const series: NgxDataPoint[] = [];
                years.forEach((year) => {
                    const yearData = rawData.find((data) => data.year === year);
                    if (yearData) {
                        series.push({
                            name: String(year),
                            value: Number(yearData[key]),
                        });
                    }
                });
                if (series.length > 0) {
                    seriesData.push({
                        name: 'summary-indicators.year-comparison-keys.' + key,
                        series,
                    });
                }
            }
        });
        return seriesData;
    }

    manipulateRawToYearComparisonDataByStatus(rawData: SummaryIndicatorsByStatusRawDataDto[], keysToIgnore?: string[]): NgxSeriesData[] {
        if (rawData.length < 1) {
            return;
        }
        if (isNil(keysToIgnore)) {
            keysToIgnore = ['year', 'status'];
        }
        const seriesData: NgxSeriesData[] = [];
        // Create a list of years and statuses
        const years = [];
        const statuses = [];
        rawData.map((data) => {
            const year = data['year'];
            const status = data['status'];
            if (!years.includes(year)) {
                years.push(year);
            }
            if (!statuses.includes(status)) {
                statuses.push(status);
            }
        });
        Object.keys(rawData[0]).forEach((key) => {
            if (!keysToIgnore.includes(key)) {
                statuses.forEach((status) => {
                    const series: NgxDataPoint[] = [];
                    years.forEach((year) => {
                        const currentData = rawData.find((data) => data.year === year && data.status === status);
                        if (currentData && Number(currentData?.count) !== 0) {
                            series.push({
                                name: String(year),
                                value: Number(currentData.count),
                            });
                        }
                    });
                    if (series.length > 0) {
                        seriesData.push({
                            name: 'summary-indicators.year-comparison-keys.' + status,
                            series,
                        });
                    }
                });
            }
        });
        return seriesData;
    }

    manipulateRawData(rawData: SummaryIndicatorsGeneralRawDataDto[], keysToIgnore?: string[]): NgxDataPoint[] {
        if (rawData.length < 1) {
            return;
        }
        if (isNil(keysToIgnore)) {
            keysToIgnore = ['year'];
        }
        const pointData: NgxDataPoint[] = [];
        Object.keys(rawData[0]).forEach((key) => {
            if (!keysToIgnore.includes(key)) {
                const currentData = rawData.map((data) => data[key]);
                if (currentData) {
                    pointData.push({
                        name: 'summary-indicators.year-comparison-keys.' + key,
                        value: Number(currentData),
                    });
                }
            }
        });
        return pointData;
    }

    manipulateRawDataByStatus(rawData: SummaryIndicatorsByStatusRawDataDto[], keysToIgnore?: string[]): NgxDataPoint[] {
        if (isNil(keysToIgnore)) {
            keysToIgnore = ['year', 'status'];
        }
        const pointData: NgxDataPoint[] = [];
        const statuses = rawData.map((data) => data['status']);
        statuses.forEach((status) => {
            const currentData = rawData.find((data) => data.status === status);
            if (currentData && Number(currentData?.count) !== 0) {
                pointData.push({
                    name: 'summary-indicators.year-comparison-keys.' + status,
                    value: Number(currentData.count),
                });
            }
        });
        return pointData;
    }
}
