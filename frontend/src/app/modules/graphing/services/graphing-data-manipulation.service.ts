import { Injectable } from '@angular/core';
import { NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { isNil } from 'lodash';
import i18next from 'i18next';
import * as moment from 'moment';
import { GeneralCompositeKeyData, GeneralRawGraphingByData } from '@modules/graphing/services/graphing-table.service';
import { DatePipe } from '@angular/common';

export class DateRangeDto {
    startDate?: string;
    endDate?: string;
}

export class TableData {
    columns: string[];
    tableArray: { [key: string]: string }[];
}

export class GraphingData {
    lineGraphData: NgxSeriesData[];
    barGraphData: NgxSeriesData[];
    tableData: TableData;
}

export class AllGraphingData extends GraphingData {
    otherLineGraphData: NgxSeriesData[];
    otherBarGraphData: NgxSeriesData[];
    otherTableData: TableData;
}

const DateKeyFormat = 'yyyy MMMM'

@Injectable({
    providedIn: 'root',
})
export class GraphingDataManipulationService {
    constructor(private datePipe: DatePipe) {}

    manipulateRawToNgxLineSeries(
        rawData: any[],
        seriesNameKey: string,
        dates: DateRangeDto,
        seriesToExclude: string[] = [],
    ): { lineGraphData: NgxSeriesData[]; otherLineGraphData: NgxSeriesData[] } {
        // Ensure all months are included

        let startDate = dates.startDate;
        if (!dates.startDate) {
            // In the case of account activation there is no start date, so calculate it
            const earliestDate = rawData.reduce((total, current) => {
                return moment(total['originalOffenceDate']).isSameOrBefore(current['originalOffenceDate']) ? total : current;
            });

            startDate = moment(earliestDate['originalOffenceDate']).toISOString();
        }

        const months = this.monthsInGivenDateRange(startDate, dates.endDate);

        const emptyDatesRefactor = {};
        months.map((month) => {
            emptyDatesRefactor[month] = 0;
        });

        // Create series data
        const dataObject = {};
        const otherDataObject = {};
        rawData.map((dataEntry) => {
            if (seriesToExclude.includes(dataEntry[seriesNameKey])) {
                if (isNil(otherDataObject[i18next.t('graphing-by-issuer.other')])) {
                    otherDataObject[i18next.t('graphing-by-issuer.other')] = { ...emptyDatesRefactor };
                }
                otherDataObject[i18next.t('graphing-by-issuer.other')][dataEntry['offenceDate']] =
                    +otherDataObject[i18next.t('graphing-by-issuer.other')][dataEntry['offenceDate']] + +dataEntry.sum;
            } else {
                if (isNil(dataObject[dataEntry[seriesNameKey]])) {
                    dataObject[dataEntry[seriesNameKey]] = { ...emptyDatesRefactor };
                }
                dataObject[dataEntry[seriesNameKey]][dataEntry['offenceDate']] =
                    +dataObject[dataEntry[seriesNameKey]][dataEntry['offenceDate']] + dataEntry.sum;

            }
        });

        // Map to series array
        const lineGraphData = [];
        Object.keys(dataObject).map((key) => {
            const seriesArray = [];
            Object.keys(dataObject[key]).map((dataPoint) => {
                seriesArray.push({ name: dataPoint, value: dataObject[key][dataPoint] });
            });
            lineGraphData.push({ name: key, series: seriesArray });
        });
        const otherLineGraphData = [];
        Object.keys(otherDataObject).map((key) => {
            const seriesArray = [];
            Object.keys(otherDataObject[key]).map((dataPoint) => {
                seriesArray.push({ name: dataPoint, value: otherDataObject[key][dataPoint] });
            });
            otherLineGraphData.push({ name: key, series: seriesArray });
        });

        return { lineGraphData, otherLineGraphData };
    }

    manipulateRawToNgXBarGraph(rawData: any[], seriesValuesKey: string, dates: DateRangeDto) {
        const dateToDataMap: { [key: string]: NgxSeriesData } = {};

        let startDate = dates.startDate;
        if (!dates.startDate) {
            // In the case of account activation there is no start date, so calculate it
            const earliestDate = rawData.reduce((total, current) => {
                return moment(total['originalOffenceDate']).isSameOrBefore(current['originalOffenceDate']) ? total : current;
            });
            startDate = moment(earliestDate['originalOffenceDate']).toISOString();
        }

        const months = this.monthsInGivenDateRange(startDate, dates.endDate, false);

        months.map((month) => {
            const dateTranslated = this.datePipe.transform(new Date(month), DateKeyFormat)
            dateToDataMap[month] = { name: dateTranslated, series: [] };
        });

        rawData.map((dataEntry) => {
            let date = moment(dataEntry['originalOffenceDate']);
            const key = date.toISOString()

            if (dateToDataMap[key] !== undefined) {
                dateToDataMap[key].series.push({
                    name: dataEntry[seriesValuesKey],
                    value: +dataEntry.sum,
                });
            }
        });

        const result = [];
        Object.keys(dateToDataMap)
            .filter((key) => dateToDataMap.hasOwnProperty(key))
            .map((key) => {
                result.push(dateToDataMap[key]);
            });

        return result;
    }

    manipulateRawVehicleToNgXBarGraph(rawData: any[]) {
        const dataObject: { [key: string]: NgxSeriesData } = {};
        const keys = [];

        rawData.map((dataEntry) => {
            if (isNil(dataObject[dataEntry.registration])) {
                dataObject[dataEntry.registration] = { name: dataEntry.registration, series: [] };
                keys.push(dataEntry.registration);
            }
            Object.keys(dataEntry.status).forEach((status) => {
                dataObject[dataEntry.registration].series.push({
                    name: i18next.t('infringement-status.' + status),
                    value: +dataEntry.status[status].sum,
                });
            });
        });

        const result = [];
        keys.map((key) => {
            result.push(dataObject[key]);
        });

        return result;
    }

    manipulateRawToTableData(
        rawData: any[],
        columnKey: string,
    ): { columns: string[]; manipulatedData: { [key: string]: string }[]; aggregatedData: any } {
        const rowKey = 'offenceDate';
        const aggregatedData = {};
        const columnsObject: { column: string; total: string }[] = [];
        const rowsAggregatedData = new Map<string, {count: number, sum: number}>()

        rawData.map((dataEntry) => {
            let rowName = dataEntry[rowKey];
            let columnName = dataEntry[columnKey];
            if (
                isNil(columnsObject[columnName]) &&
                !isNil(columnName) &&
                dataEntry.offenceDate === i18next.t('graphing-by.total_amount')
            ) {
                columnsObject.push({ column: columnName, total: dataEntry.sum });
            }

            if (isNil(aggregatedData[rowName])) {
                aggregatedData[rowName] = { row: rowName };
            }
            if (!isNil(columnName)) {
                aggregatedData[rowName][columnName] = { count: dataEntry?.count, sum: dataEntry?.sum };
            }

            let rowAggregatedData: {count: number, sum: number} = rowsAggregatedData.get(rowName)
            if (rowAggregatedData === undefined) {
                rowAggregatedData = {count: 0, sum: 0}
                rowsAggregatedData.set(rowName, rowAggregatedData)
            }

            rowAggregatedData.count += dataEntry.count
            rowAggregatedData.sum += dataEntry.sum
        });

        const rows = Object.keys(aggregatedData);
        const temp = columnsObject.sort((a, b) => (Number(a.total) < Number(b.total) ? 1 : -1));
        temp.unshift({ column: 'Total', total: '999' })

        const columns: string[] = temp.map((columnObject) => columnObject.column);
        const tableData = [];
        rows.map((row) => {
            if (row === undefined) {
                return
            }

            let rowData = this.prepareTableRow(row, aggregatedData, columns, rowKey);
            rowData['Total'] = rowsAggregatedData.get(row)
            tableData.push(rowData);
        });

        tableData.sort((prev, current) => {
            // Ensure total is always on top
            if (current.offenceDate === i18next.t('graphing-by.total_amount')) {
                return 1;
            }

            return moment(prev.offenceDate).isAfter(current.offenceDate) ? -1 : 1;
        });

        return { manipulatedData: tableData, columns, aggregatedData };
    }

    private prepareTableRow(row: string, aggregatedData: any, columns: string[], rowKey: string) {
        const rowData = {};
        rowData[rowKey] = row;
        for (const column of columns) {
            rowData[column] = aggregatedData[row][column] || 0;
        }
        return rowData;
    }

    mapToCompositeObject(data: GeneralRawGraphingByData[]): GeneralCompositeKeyData {
        const compositeObject: GeneralCompositeKeyData = {};
        data.map((dataPoint) => {
            const compositeKey = `${dataPoint.offenceDate}${dataPoint.name}`;
            const totalKey = `total${dataPoint.name}`;

            if (isNil(compositeObject[totalKey])) {
                const statusObj = {
                    [dataPoint.status]: { status: dataPoint?.status, count: dataPoint?.count, sum: dataPoint?.sum },
                };
                compositeObject[totalKey] = {
                    name: dataPoint?.name,
                    offenceDate: null,
                    count: +dataPoint?.count,
                    sum: +dataPoint?.sum,
                    status: statusObj,
                };
            } else {
                compositeObject[totalKey].sum = compositeObject[totalKey]?.sum + +dataPoint?.sum;
                compositeObject[totalKey].count = compositeObject[totalKey]?.count + +dataPoint?.count;
                compositeObject[totalKey].status[dataPoint.status] = {
                    count: dataPoint?.count,
                    sum: dataPoint?.sum,
                };
            }

            if (isNil(compositeObject[compositeKey])) {
                const statusObj = {
                    [dataPoint.status]: { status: dataPoint?.status, count: dataPoint?.count, sum: dataPoint?.sum },
                };
                compositeObject[compositeKey] = {
                    name: dataPoint?.name,
                    offenceDate: dataPoint?.offenceDate,
                    count: +dataPoint?.count,
                    sum: +dataPoint?.sum,
                    status: statusObj,
                };
            } else {
                compositeObject[compositeKey].sum = compositeObject[compositeKey]?.sum + +dataPoint?.sum;
                compositeObject[compositeKey].count = compositeObject[compositeKey]?.count + +dataPoint?.count;
                compositeObject[compositeKey].status[dataPoint.status] = {
                    count: dataPoint?.count,
                    sum: dataPoint?.sum,
                };
            }
        });
        return compositeObject;
    }

    generalisedMapToCompositeObject(data: any[], graphingByKey: string): { compositeObject: GeneralCompositeKeyData; uniqueKeys: number } {
        const compositeObject = {};
        const uniqueKeys = [...new Set(data.map((item) => item[graphingByKey]))];
        data.map((dataPoint) => {
            const compositeKey = `${dataPoint.offenceDate}${dataPoint[graphingByKey]}`;
            const totalKey = `total${dataPoint[graphingByKey]}`;

            if (isNil(compositeObject[totalKey])) {
                const statusObj = {
                    [dataPoint.status]: { status: dataPoint?.status, count: dataPoint?.count, sum: dataPoint?.sum },
                };
                compositeObject[totalKey] = {
                    [graphingByKey]: dataPoint[graphingByKey],
                    offenceDate: i18next.t('graphing-by.total_amount'),
                    count: +dataPoint?.count,
                    sum: +dataPoint?.sum,
                    status: statusObj,
                    statusName: graphingByKey === 'status' ? dataPoint?.status : null,
                    registration: dataPoint?.registration,
                };
            } else {
                compositeObject[totalKey].sum = compositeObject[totalKey]?.sum + +dataPoint?.sum;
                compositeObject[totalKey].count = compositeObject[totalKey]?.count + +dataPoint?.count;
                if (!isNil(compositeObject[totalKey].status[dataPoint?.status])) {
                    compositeObject[totalKey].status[dataPoint?.status] = {
                        count: +compositeObject[totalKey].status[dataPoint?.status]?.count + +dataPoint?.count,
                        sum: +compositeObject[totalKey].status[dataPoint?.status]?.sum + +dataPoint?.sum,
                    };
                } else {
                    compositeObject[totalKey].status[dataPoint?.status] = {
                        count: +dataPoint?.count,
                        sum: +dataPoint?.sum,
                    };
                }
            }

            if (isNil(compositeObject[compositeKey])) {
                const statusObj = {
                    [dataPoint.status]: { status: dataPoint?.status, count: dataPoint?.count, sum: dataPoint?.sum },
                };
                compositeObject[compositeKey] = {
                    [graphingByKey]: dataPoint[graphingByKey],
                    offenceDate: dataPoint?.offenceDate,
                    count: +dataPoint?.count,
                    sum: +dataPoint?.sum,
                    status: statusObj,
                    statusName: graphingByKey === 'status' ? dataPoint?.status : null,
                    registration: dataPoint?.registration,
                };
            } else {
                compositeObject[compositeKey].sum = compositeObject[compositeKey]?.sum + +dataPoint?.sum;
                compositeObject[compositeKey].count = compositeObject[compositeKey]?.count + +dataPoint?.count;
                compositeObject[compositeKey].status[dataPoint?.status] = {
                    count: dataPoint?.count,
                    sum: dataPoint?.sum,
                };
            }
        });
        return { compositeObject, uniqueKeys: uniqueKeys.length };
    }

    monthsInGivenDateRange(startDate: string, endDate: string, formatted: boolean = true): string[] {
        const months = [];
        const dateStart = moment(startDate).utc().startOf('month');
        const dateEnd = moment(endDate).utc().startOf('month');
        while (dateStart.isSameOrBefore(dateEnd)) {
            if (formatted) {
                months.push(this.datePipe.transform(new Date(dateStart.toISOString()), DateKeyFormat));
            } else {
                months.push(dateStart.toISOString());
            }
            dateStart.add(1, 'month');
        }
        return months;
    }
}
