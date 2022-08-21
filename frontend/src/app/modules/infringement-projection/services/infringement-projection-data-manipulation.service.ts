import { Injectable } from '@angular/core';
import { get, isNil } from 'lodash';
import * as moment from 'moment';
import { RawInfringementPredictionData } from '@modules/infringement-projection/services/infringement-projection.service';

@Injectable({
    providedIn: 'root',
})
export class InfringementProjectionDataManipulationService {
    constructor() {}

    private calculateMonthFromNumber(monthNumber: number) {
        // Moment month starts at 0, therefore subtract one
        return moment()
            .month(monthNumber - 1)
            .format('MMMM');
    }

    manipulateRawToTableData(
        rawData: RawInfringementPredictionData[],
        columnKey: string,
        rowKey: string,
    ): { columns: string[]; manipulatedData: { [key: string]: string }[]; aggregatedData: any } {
        const aggregatedData = {};
        const columnsObject = {};
        rawData.map((dataEntry) => {
            const currentMonth = this.calculateMonthFromNumber(dataEntry[rowKey]);
            // Adding to the columns object
            if (isNil(columnsObject[dataEntry[columnKey]]) && !isNil(dataEntry[columnKey])) {
                columnsObject[dataEntry[columnKey]] = dataEntry[columnKey];
            }
            // declaring row
            if (isNil(aggregatedData[dataEntry[rowKey]])) {
                aggregatedData[dataEntry[rowKey]] = {
                    offenceMonth: currentMonth,
                };
            }
            // Entering data per row
            if (!isNil(dataEntry[columnKey])) {
                aggregatedData[dataEntry[rowKey]][dataEntry[columnKey]] = {
                    offenceMonth: currentMonth,
                    data: {
                        infringementCount: dataEntry.infringementCount,
                        infringementCountPaid: dataEntry.infringementCountPaid ? dataEntry.infringementCountPaid : 0,
                        infringementCountClosed: dataEntry.infringementCountClosed ? dataEntry.infringementCountClosed : 0,
                        infringementCountDue: dataEntry.infringementCountDue ? dataEntry.infringementCountDue : 0,
                        infringementCountApproved: dataEntry.infringementCountApproved ? dataEntry.infringementCountApproved : 0,
                        infringementCountOutstanding: dataEntry.infringementCountOutstanding ? dataEntry.infringementCountOutstanding : 0,
                        vehicleCount: dataEntry.vehicleCount,
                        vehicleCountTotal: dataEntry.vehicleCountTotal,
                        predicted: dataEntry.predicted ? dataEntry.predicted : false,
                        value: dataEntry.value,
                        valuePaid: dataEntry.valuePaid ? dataEntry.valuePaid : 0,
                        valueClosed: dataEntry.valueClosed ? dataEntry.valueClosed : 0,
                        valueDue: dataEntry.valueDue ? dataEntry.valueDue : 0,
                        valueApproved: dataEntry.valueApproved ? dataEntry.valueApproved : 0,
                        valueOutstanding: dataEntry.valueOutstanding ? dataEntry.valueOutstanding : 0,
                        noContractCount: dataEntry.noContractCount,
                    },
                };
            }
        });

        const rows = Object.keys(aggregatedData).sort((a, b) => {
            return +a - +b;
        });
        const columns = Object.keys(columnsObject);
        const manipulatedData = [];

        rows.map((row) => {
            manipulatedData.push(this.prepareTableRow(row, aggregatedData, columns, rowKey));
        });

        return { manipulatedData, columns, aggregatedData };
    }

    private prepareTableRow(row: string, aggregatedData: any, columns: string[], rowKey: string) {
        const rowData = {};
        rowData[rowKey] = this.calculateMonthFromNumber(+row);
        for (const column of columns) {
            rowData[column] = get(aggregatedData, [row, column, 'data'], {
                infringementCount: 0,
                vehicleCount: 0,
                value: 0,
                infringementCountPaid: 0,
                infringementCountClosed: 0,
                infringementCountDue: 0,
                infringementCountApproved: 0,
                infringementCountOutstanding: 0,
                valuePaid: 0,
                valueClosed: 0,
                valueDue: 0,
                valueApproved: 0,
                valueOutstanding: 0,
            });
        }

        return rowData;
    }
}
