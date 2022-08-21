import { CrudRequest } from '@nestjsx/crud';
import { BaseEntity, SelectQueryBuilder } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { CALCULATED_FIELD_TABLE, EntityCalculatedFields } from '@modules/shared/models/calculated-fields';
import { isNil, values } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
}

export class PaginatedFilterQuery {
    static async paginatedFilterQuery<T extends BaseEntity>(
        req: CrudRequest,
        baseQuery: SelectQueryBuilder<T>,
        alias: string,
    ): Promise<PaginatedResponse<T>> {
        this.andFilters<T>(req, baseQuery, alias);

        // this.orFilters<T>(req, baseQuery, alias); // Omitted for now

        this.sorts<T>(req, baseQuery, alias);

        return this.paginatedQuery<T>(req, baseQuery);
    }

    private static async paginatedQuery<T>(req: CrudRequest, baseQuery: SelectQueryBuilder<T>): Promise<PaginatedResponse<T>> {
        const take = req.parsed.limit || req.options.query.limit || 10;

        let page = req.parsed.page > 0 ? req.parsed.page : 1;

        // Paginate
        // NOTE: skip & take does not work with calculated field sorts
        // https://github.com/typeorm/typeorm/pull/4257#issuecomment-518274842
        baseQuery = baseQuery.take(take).skip((page - 1) * take);
        // BUT: limit and offset does, there are probably issues with limit and offset as described here:
        // https://typeorm.io/#/select-query-builder/using-pagination
        // baseQuery = baseQuery.limit(take).offset((page - 1) * take);

        // Query
        const [data, total] = await baseQuery.getManyAndCount();

        const pageCount = Math.ceil(total / take);
        if (page > pageCount) {
            page = pageCount;
        }
        return {
            data,
            count: data.length,
            total,
            page,
            pageCount,
        };
    }

    private static sorts<T>(req: CrudRequest, baseQuery: SelectQueryBuilder<T>, alias: string) {
        for (const sort of req.parsed.sort) {
            if (sort.field.split('.').length <= 1) {
                sort.field = `${alias}.${sort.field}`;
            }
            baseQuery.addOrderBy(`${sort.field}`, sort.order);
        }
    }

    private static orFilters<T>(req: CrudRequest, baseQuery: SelectQueryBuilder<T>, alias: string) {
        let uniqueParameterIndex = 1; // Used to ensure parameters don't interfere
        for (const filter of req.parsed.or) {
            if (filter.field.split('.').length <= 1) {
                filter.field = `${alias}.${filter.field}`;
            }
            const parameters: any = {};
            const key = 'or' + uniqueParameterIndex;
            parameters[key] = filter.value;
            if (filter.operator === 'eq') {
                baseQuery.orWhere(`${filter.field} = :${key}`, parameters);
            } else if (filter.operator === 'ne') {
                baseQuery.orWhere(`${filter.field} != :${key}`, parameters);
            } else if (filter.operator === 'gt') {
                baseQuery.orWhere(`${filter.field} > :${key}`, parameters);
            } else if (filter.operator === 'lt') {
                baseQuery.orWhere(`${filter.field} < :${key}`, parameters);
            } else if (filter.operator === 'gte') {
                baseQuery.orWhere(`${filter.field} >= :${key}`, parameters);
            } else if (filter.operator === 'lte') {
                baseQuery.orWhere(`${filter.field} <= :${key}`, parameters);
            } else if (filter.operator === 'starts') {
                throw new BadRequestException({ message: ERROR_CODES.E153_FilterIsNotSupported.message() });
            } else if (filter.operator === 'ends') {
                throw new BadRequestException({ message: ERROR_CODES.E153_FilterIsNotSupported.message() });
            } else if (filter.operator === 'cont') {
                parameters[key] = `%${filter.value}%`;
                baseQuery.orWhere(`${filter.field} LIKE :${key}`, parameters);
            } else if (filter.operator === 'excl') {
                throw new BadRequestException({ message: ERROR_CODES.E153_FilterIsNotSupported.message() });
            } else if (filter.operator === 'in') {
                baseQuery.orWhere(`${filter.field} IN (:...${key})`, parameters);
            } else if (filter.operator === 'notin') {
                baseQuery.orWhere(`${filter.field} NOT IN (:...${key})`, parameters);
            } else if (filter.operator === 'isnull') {
                baseQuery.orWhere(`${filter.field} IS NULL`);
            } else if (filter.operator === 'notnull') {
                baseQuery.orWhere(`${filter.field} IS NOT NULL`);
            } else if (filter.operator === 'between') {
                if (filter.value.length !== 2) {
                    throw new BadRequestException({ message: ERROR_CODES.E154_InvalidBetweenFilter.message() });
                }
                parameters[key + 'min'] = filter.value[0];
                parameters[key + 'max'] = filter.value[1];
                baseQuery.orWhere(`${filter.field} BETWEEN :${key + 'min'} AND :${key + 'max'}`, parameters);
            } else {
                throw new BadRequestException({ message: ERROR_CODES.E155_InvalidFilter.message() });
            }
            uniqueParameterIndex++;
        }
    }

    private static andFilters<T>(req: CrudRequest, baseQuery: SelectQueryBuilder<T>, alias: string) {
        let uniqueParameterIndex = 1; // Used to ensure parameters don't interfere
        for (const filter of req.parsed.filter) {
            if (filter.field.split('.').length <= 1) {
                filter.field = `${alias}.${filter.field}`;
            }
            const parameters: any = {};
            const key = 'and' + uniqueParameterIndex;
            parameters[key] = filter.value;
            if (filter.operator === 'eq') {
                baseQuery.andWhere(`${filter.field} = :${key}`, parameters);
            } else if (filter.operator === 'ne') {
                baseQuery.andWhere(`${filter.field} != :${key}`, parameters);
            } else if (filter.operator === 'gt') {
                baseQuery.andWhere(`${filter.field} > :${key}`, parameters);
            } else if (filter.operator === 'lt') {
                baseQuery.andWhere(`${filter.field} < :${key}`, parameters);
            } else if (filter.operator === 'gte') {
                baseQuery.andWhere(`${filter.field} >= :${key}`, parameters);
            } else if (filter.operator === 'lte') {
                baseQuery.andWhere(`${filter.field} <= :${key}`, parameters);
            } else if (filter.operator === 'starts') {
                throw new BadRequestException({ message: ERROR_CODES.E153_FilterIsNotSupported.message() });
            } else if (filter.operator === 'ends') {
                throw new BadRequestException({ message: ERROR_CODES.E153_FilterIsNotSupported.message() });
            } else if (filter.operator === 'cont') {
                parameters[key] = `%${filter.value}%`;
                baseQuery.andWhere(`${filter.field} LIKE :${key}`, parameters);
            } else if (filter.operator === 'excl') {
                parameters[key] = `%${filter.value}%`;
                baseQuery.andWhere(`${filter.field} NOT LIKE :${key}`, parameters);
            } else if (filter.operator === 'in') {
                // Workaround for infringement tags
                if (filter.field === `infringement.tags`) {
                    // Somehow typeorm corrupts passed params, which results in text array in where clause, so we cast to int
                    baseQuery.andWhere(`${filter.field} @> array[:...${key}]::int[]`, parameters);
                } else {
                    baseQuery.andWhere(`${filter.field} IN (:...${key})`, parameters);
                }
            } else if (filter.operator === 'notin') {
                baseQuery.andWhere(`${filter.field} NOT IN (:...${key})`, parameters);
            } else if (filter.operator === 'isnull') {
                baseQuery.andWhere(`${filter.field} IS NULL`);
            } else if (filter.operator === 'notnull') {
                baseQuery.andWhere(`${filter.field} IS NOT NULL`);
            } else if (filter.operator === 'between') {
                if (filter.value.length !== 2) {
                    throw new BadRequestException({ message: ERROR_CODES.E154_InvalidBetweenFilter.message() });
                }
                parameters[key + 'min'] = filter.value[0];
                parameters[key + 'max'] = filter.value[1];
                baseQuery.andWhere(`${filter.field} BETWEEN :${key + 'min'} AND :${key + 'max'}`, parameters);
            } else {
                throw new BadRequestException({ message: ERROR_CODES.E155_InvalidFilter.message() });
            }
            uniqueParameterIndex++;
        }
    }

    private static resolveCalculatedFields<T extends BaseEntity>(
        req: CrudRequest,
        baseQuery: SelectQueryBuilder<T>,
        calculatedFields: EntityCalculatedFields<T>,
    ) {
        if (!isNil(calculatedFields)) {
            // Map fields that should be calculated fields by prefixing their table name
            const filters = req.parsed.filter;
            for (const filter of filters) {
                if (calculatedFields.calculatedFields[filter.field]) {
                    filter.field = `"${CALCULATED_FIELD_TABLE}"."${filter.field}"`;
                }
            }

            const sorts = req.parsed.sort;
            for (const sort of sorts) {
                if (calculatedFields.calculatedFields[sort.field]) {
                    sort.field = `"${CALCULATED_FIELD_TABLE}"."${sort.field}"`;
                }
            }

            // Add the calculated field join
            this.addCalculatedFieldsJoin(baseQuery, calculatedFields);
        }
    }

    private static addCalculatedFieldsJoin<T extends BaseEntity>(
        query: SelectQueryBuilder<T>,
        calculatedFields: EntityCalculatedFields<T>,
    ) {
        const calculatedFieldValues = values(calculatedFields.calculatedFields);
        query.leftJoin(
            (subquery) => {
                subquery.addSelect(`${calculatedFields.alias()}.${calculatedFields.idField()}`, `${calculatedFields.idField()}`);
                for (const field of calculatedFieldValues) {
                    subquery.addSelect(`${field.filter.selectStatement()}`, `${field.filter.selectAlias()}`);
                }
                subquery.from(calculatedFields.entity(), calculatedFields.alias());

                return subquery;
            },
            `${CALCULATED_FIELD_TABLE}`,
            `"${CALCULATED_FIELD_TABLE}"."${calculatedFields.idField()}" = "${calculatedFields.alias()}"."${calculatedFields.idField()}"`,
        );
    }
}
