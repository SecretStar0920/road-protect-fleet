import { SingleSeries } from '@swimlane/ngx-charts';
import { IsDefined } from 'class-validator';

export class ReportingDataDto<T = SingleSeries> {
    @IsDefined()
    data: T;
}

export enum MetabaseModel {
    'card',
    'collection',
    'dashboard',
    'pulse',
}

export interface IMetabaseItemDetails {
    id: number;
    name: string;
    description: null | string;
    collection_position: null | string;
    display?: string;
    favorite?: boolean;
    model: MetabaseModel;
    embeddedUrl: string;
}

export interface MetabaseItemDetailsArray extends Array<IMetabaseItemDetails> {}
