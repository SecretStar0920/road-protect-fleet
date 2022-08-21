import { mapValues, isString } from 'lodash';
import { httpClient } from '@modules/shared/http-client/http-client';

export interface IsraelGovernmentDataResponse<T> {
    help: string;
    success: boolean;
    result: Result<T>;
}

export interface Result<T> {
    include_total: boolean;
    resource_id: string;
    fields: Field[];
    records_format: string;
    records: T[];
    limit: number;
    _links: Links;
}

export interface Links {
    start: string;
    next: string;
}

export interface Field {
    type: string;
    id: string;
}

export interface StreetCodeRecord {
    _id: number;
    טבלה: string; // Table
    סמל_ישוב: number; // Icon_City
    שם_ישוב: string; // Name_ locality
    סמל_רחוב: number; // Street Icon
    שם_רחוב: string; // Street name
}

export interface LocalityRecord {
    _id: number;
    טבלה: string; // Table
    סמל_ישוב: number; // Icon_City
    שם_ישוב: string; // Name_ locality
    שם_ישוב_לועזי: string; // Name_Location_Lazi
    סמל_נפה: string; // Icon_snap
    שם_נפה: string; // Name_sun
    סמל_לשכת_מנא: number; // Icon_manager_manna
    לשכה: string; // office
    סמל_מועצה_איזורית: number; // Regional council symbol
    שם_מועצה: string; // Council_name
}

export class IsraelGovernmentDataIntegration {
    baseUrl = 'https://data.gov.il/api/3/action/datastore_search';
    resources = {
        streetCodes: 'a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3',
        localities: '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba',
    };
    defaultLimit = 100000;

    async getStreetCodes(): Promise<IsraelGovernmentDataResponse<StreetCodeRecord>> {
        const url = this.getUrl(this.resources.streetCodes);
        const data: IsraelGovernmentDataResponse<StreetCodeRecord> = await httpClient.get(url).json();
        data.result.records = this.trimRecordValues(data.result.records) as any[];
        return data;
    }

    async getLocalities(): Promise<IsraelGovernmentDataResponse<LocalityRecord>> {
        const url = this.getUrl(this.resources.localities);
        const data: IsraelGovernmentDataResponse<LocalityRecord> = await httpClient.get(url).json();
        data.result.records = this.trimRecordValues(data.result.records) as any[];
        return data;
    }

    private getUrl(resource: string) {
        return `${this.baseUrl}?resource_id=${resource}&limit=${this.defaultLimit}`;
    }

    private trimRecordValues(records: any[]) {
        return records.map((record) => {
            return mapValues(record, (value) => {
                if (isString(value)) {
                    return value.trim();
                }
                return value;
            });
        });
    }
}
