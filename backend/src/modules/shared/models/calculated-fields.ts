import { Dictionary } from 'lodash';
import { BaseEntity } from 'typeorm';

export const CALCULATED_FIELD_TABLE = 'calculatedFields';

export type CalculatedFieldFilter = {
    selectStatement: (...args) => string;
    selectAlias: (...args) => string;
};

export type CalculatedField<T = any> = {
    key: string;
    afterLoad: (target: T) => Promise<void>;
    filter: CalculatedFieldFilter;
};

export type CalculatedFields<T = any> = Dictionary<CalculatedField<T>>;

export type EntityCalculatedFields<T extends BaseEntity> = {
    entity: () => typeof BaseEntity;
    alias: () => string;
    idField: () => string;
    calculatedFields: CalculatedFields<T>;
};
