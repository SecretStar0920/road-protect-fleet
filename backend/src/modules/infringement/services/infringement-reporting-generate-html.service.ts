import { Injectable } from '@nestjs/common';

@Injectable()
export class InfringementReportingGenerateHtmlService {
    generateSummaryPageHtml(tableData: object[], accountName: string): string {
        const styling = 'body { margin: 0; padding: 50px;}';
        const heading = ` סיכום דו"חות עבור ${accountName}`;
        const header = `<img src="https://www.roadprotect.co.za/wp-content/uploads/2018/08/cropped-blue_logo.png"
            width="295"
            height="94"
            alt=""
            style="display:block;  margin-left: auto;  margin-right: auto;  width:30%;  height:auto"
            class="full-width img295x94"/>
      <h2  dir="rtl"> ${heading}  </h2>`;

        const table = this.jsonToTable(tableData);

        return ` <style> ${styling} </style> ${header} ${table} `;
    }

    jsonToTable(tableData: object[]): string {
        const cols = Object.keys(tableData[0]);

        // rows in table
        const rows = tableData
            .map((row) => {
                const cell = cols.map((col) => `<td>${row[col]}</td>`).join('');
                return `<tr>${cell}</tr>`;
            })
            .join('');

        // build the table
        return `
            <table dir="rtl" width="100%">
                <tbody>
                    ${rows}
                <tbody>
            <table>`;
    }
}
