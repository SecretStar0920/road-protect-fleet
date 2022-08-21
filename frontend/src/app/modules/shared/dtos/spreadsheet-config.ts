import 'reflect-metadata';
import { cloneDeep } from 'lodash';

export const SPREADSHEET_METADATA_KEY = 'spreadsheet:config';

export class SpreadsheetMetadataParams {
    required?: boolean = false;
    order?: number = 0; // Higher equals higher priority
    label?: string;
    key?: string;

    constructor(obj: any = {}) {
        this.required = obj.required === true ? obj.required : false;
        this.order = obj.order || 0;
        this.label = obj.label;
    }
}

export function SpreadsheetMetadata(params: SpreadsheetMetadataParams = {}) {
    params = new SpreadsheetMetadataParams(params);
    return (target: object, propertyKey: string | symbol) => {
        // Clone deep is important to prevent pollution of the parent metadata
        const currentMetadata = cloneDeep(Reflect.getMetadata(SPREADSHEET_METADATA_KEY, target)) || {};
        if (!params.label) {
            params.label = propertyKey as string;
        }
        params.key = propertyKey as string;
        currentMetadata[propertyKey] = params;
        Reflect.defineMetadata(SPREADSHEET_METADATA_KEY, currentMetadata, target);
    };
}

export function GetSpreadsheetConfig(target: any): { [param: string]: SpreadsheetMetadataParams } {
    return Reflect.getMetadata(SPREADSHEET_METADATA_KEY, target);
}

export function HasSpreadsheetConfig(target: any) {
    return Reflect.hasMetadata(SPREADSHEET_METADATA_KEY, target);
}
