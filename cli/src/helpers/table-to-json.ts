import { isEmpty, keyBy } from 'lodash';

export function tableToJson(table: string): any {
    let rows: any[] = table.split('\n').filter((row) => !isEmpty(row));
    // Remove whitespace
    rows = rows.map((row) => {
        row = row.replace(/\s+/g, ' ');
        row = row.split(' ');
        return row;
    });

    const headings = rows[0];
    const tempRows: any[] = [];
    for (let j = 1; j < rows.length; j++) {
        const tempRow: any = {};
        for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            tempRow[heading] = rows[j][i];
        }
        tempRows.push(tempRow);
    }

    return tempRows;
}

export function tableToKeyedJson(table: string, key: string) {
    const json = tableToJson(table);
    return keyBy(json, key);
}
