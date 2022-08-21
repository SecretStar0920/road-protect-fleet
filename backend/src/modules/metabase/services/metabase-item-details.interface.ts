export interface IMetabaseItems {
    data: IMetabaseItemDetails[];
}

export type MetabaseModel = 'card' | 'collection' | 'dashboard' | 'pulse';

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

export const MODEL_RESOURCE_MAP = {
    card: 'question',
    dashboard: 'dashboard',
};
