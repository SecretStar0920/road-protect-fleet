import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { isArray, isEmpty } from 'lodash';
import { BaseEntity } from 'typeorm';

export enum FilterCondition {
    eq = '=',
    ne = '!=',
    gt = '>',
    lt = '<',
    gte = '>=',
    lte = '<=',
}

export class FilterQuery {
    @IsString()
    field: string;
    @IsIn(Object.keys(FilterCondition))
    condition: FilterCondition;
    @IsString()
    value: string;

    constructor(value: string) {
        const split = value.split('||');
        if (split.length === 3) {
            this.field = split[0];
            this.condition = split[1] as FilterCondition;
            this.value = split[2];
        }
    }
}

export class SortQuery {
    @IsString()
    field: string;
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC';

    constructor(value: string) {
        const split = value.split(',');
        if (split.length === 2) {
            this.field = split[0];
            if (split[1] === 'ASC') {
                this.order = 'ASC';
            } else {
                this.order = 'DESC';
            }
        }
    }
}

/**
 * WIP
 */
export class GetQueryDto {
    @IsString({ each: true })
    @IsOptional()
    @Transform((val) => val.split(','))
    fields: string[]; // Which fields to select from the entity

    @Transform((val) => {
        if (isArray(val)) {
            return val.map((valItem) => new FilterQuery(valItem));
        } else {
            return [new FilterQuery(val)];
        }
    })
    @IsOptional()
    @Type(() => FilterQuery)
    @ValidateNested()
    filter: FilterQuery[];

    @Transform((val) => new SortQuery(val))
    @IsOptional()
    @Type(() => SortQuery)
    @ValidateNested()
    sort: SortQuery;

    async generateQuery(entity: typeof BaseEntity) {
        const queryBuilder = await entity.createQueryBuilder('entity');
        this.fields = this.fields.map((field) => `entity.${field}`);
        if (!isEmpty(this.fields)) {
            queryBuilder.select(this.fields);
        }
        this.filter.forEach((filter) => {
            queryBuilder.andWhere(`entity."${filter.field}" ${FilterCondition[filter.condition]} :value`, { value: filter.value });
        });

        return queryBuilder;
    }
}
