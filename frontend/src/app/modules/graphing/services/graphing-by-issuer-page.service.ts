import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, take, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { Observable } from 'rxjs';
import {
    byIssuerOtherIssuersPerDateRange,
    graphingByIssuer,
    graphingByIssuerExclude,
    graphingByIssuerMappedTableData,
    graphingByIssuerPreviousYear,
    graphingByIssuerTotals,
    graphingByIssuerTranslatedData,
} from '@modules/graphing/ngrx/graphing.actions';
import {
    AllGraphingData,
    DateRangeDto,
    GraphingData,
    GraphingDataManipulationService,
    TableData,
} from '@modules/graphing/services/graphing-data-manipulation.service';
import {
    GeneralCompositeKeyData,
    GeneralMappedGraphingByData,
    GeneralRawGraphingByData,
} from '@modules/graphing/services/graphing-table.service';
import {
    GraphingDataDto,
    ReportingEndpoints,
} from '@modules/graphing/components/general-graphing-by-page/general-graphing-by-page.component';
import {
    byIssuerBarGraphData,
    byIssuerLineGraphData,
    byIssuerMappedTableData,
    byIssuerNumber,
    byIssuerOtherBarGraphData,
    byIssuerOtherLineGraphData,
    byIssuerTotals,
    byIssuerTranslatedData,
    dateRange,
    showOther,
} from '@modules/graphing/ngrx/graphing.selector';
import { isNil } from 'lodash';
import i18next from 'i18next';
import { NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { DatePipe } from '@angular/common';
import { policeIssuer } from '@modules/issuer/ngrx/issuer.selectors';
import { Issuer } from '@modules/shared/models/entities/issuer.model';

@Injectable({
    providedIn: 'root',
})
export class GraphingByIssuerPageService {
    constructor(
        private http: HttpService,
        private store: Store<GraphingState>,
        private datePipe: DatePipe,
        private graphingDataManipulationService: GraphingDataManipulationService,
    ) {}

    getGraphingByIssuerData(dto: DateRangeDto, endpoint?: ReportingEndpoints): Observable<GeneralRawGraphingByData[]> {
        const newDto: GraphingDataDto = { ...dto, endpoint };
        return this.http.postSecure('graphing/by-issuer', newDto).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(GeneralRawGraphingByData, item));
                }
                return [];
            }),
            tap((data: any[]) => {
                this.store.dispatch(graphingByIssuer({ data, dto }));
            }),
        );
    }

    getGraphingByIssuerPreviousYearData(
        dto: DateRangeDto,
        numberOfYears: number,
        endpoint: ReportingEndpoints,
    ): Observable<GeneralRawGraphingByData[]> {
        const newDto: GraphingDataDto = { ...dto, endpoint };
        return this.http.postSecure(`graphing/by-issuer`, newDto).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(GeneralRawGraphingByData, item));
                }
                return [];
            }),
            tap((data: any[]) => {
                this.store.dispatch(graphingByIssuerPreviousYear({ data, numberOfYears }));
            }),
        );
    }

    issuerTableData(tableArray?: GeneralMappedGraphingByData[], excludedIssuers?: string[]): TableData {
        let resultArray: GeneralMappedGraphingByData[];
        if (!!tableArray) {
            resultArray = tableArray;
        } else {
            this.store.pipe(select(byIssuerMappedTableData), take(1)).subscribe((result) => {
                if (!isNil(result)) {
                    resultArray = result;
                }
            });
        }
        if (!!excludedIssuers) {
            resultArray = resultArray.filter((item) => {
                return !excludedIssuers.includes(item.name);
            });
        }
        // Add in police if it is not there
        let police: Issuer;
        this.store.pipe(select(policeIssuer), take(1)).subscribe((result) => {
            police = result;
            if (!!police && !resultArray.find((item) => item.name === police.name)) {
                resultArray.push({ name: police.name });
            }
        });
        const columnKey = 'name';

        const data = this.graphingDataManipulationService.manipulateRawToTableData(resultArray, columnKey);
        // Add police if there is none
        if (!!police && !data.columns.find((name) => name === police.name)) {
            data.columns.push(police.name);
        }
        // Ensure police is always first
        data.columns = data.columns.sort((a, b) => {
            if (a === 'Total') {
                return -1
            } else if (b === 'Total'){
                return 1;
            } else if (a === police?.name) {
                return -1;
            } else if (b === police?.name) {
                return 1;
            } else {
                return 0
            }
        });
        return { columns: data.columns, tableArray: data.manipulatedData };
    }

    initialiseIssuerData(compositeObject: GeneralCompositeKeyData): AllGraphingData {
        const resultArray = [];
        Object.keys(compositeObject).forEach((key) => {
            if (!isNil(compositeObject[key].offenceDate) && compositeObject[key].offenceDate !== i18next.t('graphing-by.total_amount')) {
                resultArray.push(compositeObject[key]);
            }
        });
        const issuerTotals: { [key: string]: { name: string; total: number } } = {};
        const translatedData = resultArray.map((dataEntry) => {
            if (isNil(issuerTotals[dataEntry.name])) {
                issuerTotals[dataEntry.name] = { name: dataEntry.name, total: 0 };
            }

            issuerTotals[dataEntry.name].total = issuerTotals[dataEntry.name].total + Number(dataEntry.sum);

            return {
                ...dataEntry,
                offenceDate: this.datePipe.transform(new Date(dataEntry.offenceDate), 'yyyy MMMM'),
                originalOffenceDate: dataEntry.offenceDate
            };
        });
        this.store.dispatch(graphingByIssuerTotals({ issuerTotals }));
        this.store.dispatch(graphingByIssuerTranslatedData({ translatedData }));

        let issuerNumber: number;
        this.store.pipe(select(byIssuerNumber), take(1)).subscribe((totals) => {
            if (!isNil(totals)) {
                issuerNumber = totals;
            }
        });

        // Table Data
        const tableArray: GeneralMappedGraphingByData[] = Object.keys(compositeObject).map((key) => {
            return compositeObject[key];
        });
        this.store.dispatch(graphingByIssuerMappedTableData({ data: tableArray }));

        return this.restrictNumberOfIssuers(issuerNumber, issuerTotals, translatedData, tableArray);
    }

    changeOthersShowing(
        lineGraphData?: NgxSeriesData[],
        barGraphData?: NgxSeriesData[],
        otherBarGraphData?: NgxSeriesData[],
    ): GraphingData {
        let showOthers = false;
        this.store.pipe(select(showOther), take(1)).subscribe((result) => {
            if (!isNil(result)) {
                showOthers = result;
            }
        });

        if (!lineGraphData) {
            this.store.pipe(select(byIssuerLineGraphData), take(1)).subscribe((result) => {
                if (!isNil(result)) {
                    lineGraphData = result;
                }
            });
        }
        if (!barGraphData) {
            this.store.pipe(select(byIssuerBarGraphData), take(1)).subscribe((result) => {
                if (!isNil(result)) {
                    barGraphData = result;
                }
            });
        }
        if (showOthers) {
            this.store.pipe(select(byIssuerOtherLineGraphData), take(1)).subscribe((result) => {
                if (!isNil(result)) {
                    lineGraphData = [...lineGraphData, ...result];
                }
            });
            if (!otherBarGraphData) {
                this.store.pipe(select(byIssuerOtherBarGraphData), take(1)).subscribe((result) => {
                    if (!isNil(result)) {
                        barGraphData = result;
                    }
                });
            } else {
                barGraphData = otherBarGraphData;
            }
        } else {
            // Remove other
            lineGraphData = lineGraphData?.filter((dataPoint) => dataPoint.name !== i18next.t('graphing-by-issuer.other'));
            barGraphData = barGraphData?.map((dataPoint) => {
                const series = dataPoint.series.filter((issuer) => issuer.name !== i18next.t('graphing-by-issuer.other'));
                return { name: dataPoint.name, series: series ? series : [] };
            });
        }
        return { lineGraphData, barGraphData, tableData: undefined };
    }

    restrictNumberOfIssuers(
        groupedIssuers: number,
        issuerTotals?: { [key: string]: { name: string; total: number } },
        translatedData?: GeneralMappedGraphingByData[],
        tableArray?: GeneralMappedGraphingByData[],
    ): AllGraphingData {
        const seriesNameKey: string = 'name';
        if (!issuerTotals) {
            this.store.pipe(select(byIssuerTotals), take(1)).subscribe((totals) => {
                if (!isNil(totals)) {
                    issuerTotals = totals;
                }
            });
        }
        let selectedDateRange: DateRangeDto;
        this.store.pipe(select(dateRange), take(1)).subscribe((dates) => {
            if (!isNil(dates)) {
                selectedDateRange = dates;
            }
        });
        const excludedIssuers = Object.values(issuerTotals)
            .sort((n1, n2) => {
                if (n1.total > n2.total) {
                    return -1;
                }

                if (n1.total < n2.total) {
                    return 1;
                }

                return 0;
            })
            .slice(groupedIssuers)
            .map((issuerTotal) => {
                return issuerTotal.name;
            });
        this.store.dispatch(graphingByIssuerExclude({ issuersToExclude: excludedIssuers }));
        if (!translatedData) {
            this.store.pipe(select(byIssuerTranslatedData), take(1)).subscribe((data) => {
                if (!isNil(data)) {
                    translatedData = data;
                }
            });
        }
        let { lineGraphData, otherLineGraphData } = this.graphingDataManipulationService.manipulateRawToNgxLineSeries(
            translatedData,
            seriesNameKey,
            selectedDateRange,
            excludedIssuers,
        );

        let showOthers = false;
        this.store.pipe(select(showOther), take(1)).subscribe((result) => {
            if (!isNil(result)) {
                showOthers = result;
            }
        });
        // Bar graph
        const manipulatedData = this.graphingDataManipulationService.manipulateRawToNgXBarGraph(
            translatedData,
            seriesNameKey,
            selectedDateRange,
        );
        const otherIssuersPerDateRange: { [selectionDate: string]: string[] } = {};
        const otherBarGraphData: NgxSeriesData[] = [];
        let barGraphData: NgxSeriesData[] = manipulatedData.map((stackSeries) => {
            const otherIssuers = stackSeries.series.filter((issuer) => excludedIssuers.includes(issuer.name));
            if (!otherIssuers || otherIssuers.length < 1) {
                otherBarGraphData.push(stackSeries);
                return stackSeries;
            }
            // Reduce other issuers
            otherIssuersPerDateRange[stackSeries.name] = [];
            const other = otherIssuers.reduce((totalIssuer, currentIssuer) => {
                otherIssuersPerDateRange[stackSeries.name].push(currentIssuer.name);
                return {
                    name: i18next.t('graphing-by-issuer.other'),
                    value: totalIssuer.value + currentIssuer.value,
                };
            });
            other.name = i18next.t('graphing-by-issuer.other');

            const keepIssuers = stackSeries.series.filter(
                (issuer) => !excludedIssuers.includes(issuer.name) && issuer.name !== i18next.t('graphing-by-issuer.other'),
            );
            stackSeries.series = [...keepIssuers];
            otherBarGraphData.push({ name: stackSeries.name, series: [...keepIssuers, ...other] });
            return stackSeries;
        });
        this.store.dispatch(byIssuerOtherIssuersPerDateRange({ otherIssuersPerDateRange }));

        const tableData = this.issuerTableData(tableArray, excludedIssuers);
        if (showOthers) {
            const result = this.changeOthersShowing(lineGraphData, barGraphData, otherBarGraphData);
            lineGraphData = result.lineGraphData;
            barGraphData = result.barGraphData;
        }
        return { lineGraphData, barGraphData, tableData, otherLineGraphData, otherBarGraphData, otherTableData: undefined };
    }
}
