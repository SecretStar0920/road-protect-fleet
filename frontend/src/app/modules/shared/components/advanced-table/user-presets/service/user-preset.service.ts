import { Injectable } from '@angular/core';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { of } from 'rxjs';
import { HttpService } from '@modules/shared/services/http/http.service';

export class TablePreset {
    id: number;
    name: string;
    filters: { [key: string]: any };
    columns: string[];
    default: boolean;
}

export class UpsertTablePresetDto {
    id?: number;
    name: string;
    filters: { [key: string]: any };
    columns: string[];
    default: boolean;
}

export class UserPreset {
    infringementTable?: TablePreset[];
    contractTable?: TablePreset[];
    vehicleTable?: TablePreset[];
    accountUserTable?: TablePreset[];
    relationTable?: TablePreset[];
    reportTable?: TablePreset[];
    userTable?: TablePreset[];
    accountsTable?: TablePreset[];
    nominationsTable?: TablePreset[];
    issuerTable?: TablePreset[];
    paymentsTable?: TablePreset[];
    driverTable?: TablePreset[];
    integrationRequestLogsTable?: TablePreset[];
    jobLogsTable?: TablePreset[];
    rawInfringementLogsTable?: TablePreset[];
    infoRequestLogsTable?: TablePreset[];
    partialInfringementTable?: TablePreset[];
}

export enum AdvancedTableNameEnum {
    contractTable = 'contractTable',
    infringementTable = 'infringementTable',
    vehicleTable = 'vehicleTable',
    accountUserTable = 'accountUserTable',
    relationTable = 'relationTable',
    reportTable = 'reportTable',
    userTable = 'userTable',
    accountsTable = 'accountsTable',
    nominationsTable = 'nominationsTable',
    issuerTable = 'issuerTable',
    paymentsTable = 'paymentsTable',
    driverTable = 'driverTable',
    integrationRequestLogsTable = 'integrationRequestLogsTable',
    jobLogsTable = 'jobLogsTable',
    rawInfringementLogsTable = 'rawInfringementLogsTable',
    infoRequestLogsTable = 'infoRequestLogsTable',
    partialInfringementTable = 'partialInfringementTable',
}

export class UpsertUserPreferenceDto {
    preset: UpsertTablePresetDto;
    currentTable: AdvancedTableNameEnum;
}

@Injectable({
    providedIn: 'root',
})
export class UserPresetService {
    constructor(private http: HttpService) {}

    deleteUserPreset(dto: UpsertUserPreferenceDto) {
        return this.http.postSecure(`presets/delete`, dto);
    }

    upsertUserPreset(dto: UpsertUserPreferenceDto) {
        return this.http.postSecure(`presets`, dto);
    }

    convertColumns(tableCols: AdvancedTableColumn[]) {
        const displayingCols = tableCols
            .filter((col) => col.isDisplaying)
            .map((col) => {
                if (col.isDisplaying) {
                    return col.key;
                }
            });
        return of(displayingCols);
    }

    setDisplayingColumns(tableCols: AdvancedTableColumn[], selectedCols: string[]): AdvancedTableColumn[] {
        const displayingCols = tableCols.map((col) => {
            if (selectedCols.includes(col.key)) {
                col.isDisplaying = true;
                return col;
            } else {
                col.isDisplaying = false;
                return col;
            }
        });
        return displayingCols;
    }

    getUserPreset() {
        return this.http.getSecure(`presets`);
    }
}
