import { FilterKeyType } from '@modules/shared/models/filter-key.model';

export enum CondOperator {
    EQUALS = 'eq',
    NOT_EQUALS = 'ne',
    GREATER_THAN = 'gt',
    LOWER_THAN = 'lt',
    GREATER_THAN_EQUALS = 'gte',
    LOWER_THAN_EQUALS = 'lte',
    CONTAINS = 'cont',
    EXCLUDES = 'excl',
    IN = 'in',
    // NOT_IN = 'notin',
    IS_NULL = 'isnull',
    NOT_NULL = 'notnull',
    BETWEEN = 'between',
}

export const OPERATOR_DISPLAY = new Map<string, string>([
    [CondOperator.EQUALS, '= (equals)'],
    [CondOperator.NOT_EQUALS, '!= (not equal)'],
    [CondOperator.GREATER_THAN, '> (greater than)'],
    [CondOperator.LOWER_THAN, '< (less than)'],
    [CondOperator.GREATER_THAN_EQUALS, '>= (greater than equal to)'],
    [CondOperator.LOWER_THAN_EQUALS, '<= (less than equal to)'],
    [CondOperator.CONTAINS, 'includes / contains'],
    [CondOperator.EXCLUDES, 'excludes / not equal'],
    // [CondOperator.IN, 'Is one of'],
    // [CondOperator.NOT_IN, 'Is not one of'],
    [CondOperator.NOT_NULL, 'Is specified'],
    [CondOperator.IS_NULL, 'Is not specified'],
    [CondOperator.BETWEEN, 'Is in the range'],
]);

export const TYPE_OPERATORS = {
    [FilterKeyType.String]: [
        CondOperator.EQUALS,
        CondOperator.NOT_EQUALS,
        CondOperator.CONTAINS,
        CondOperator.EXCLUDES,
        CondOperator.NOT_NULL,
        CondOperator.IS_NULL,
    ],
    [FilterKeyType.Date]: [
        CondOperator.BETWEEN,
        CondOperator.GREATER_THAN_EQUALS,
        CondOperator.GREATER_THAN,
        CondOperator.LOWER_THAN_EQUALS,
        CondOperator.LOWER_THAN,
        CondOperator.NOT_EQUALS,
        CondOperator.EQUALS,
        CondOperator.NOT_NULL,
        CondOperator.IS_NULL,
    ],
    [FilterKeyType.Dropdown]: [CondOperator.EQUALS, CondOperator.NOT_EQUALS, CondOperator.NOT_NULL, CondOperator.IS_NULL],
    [FilterKeyType.Number]: [
        CondOperator.NOT_EQUALS,
        CondOperator.EQUALS,
        CondOperator.BETWEEN,
        CondOperator.GREATER_THAN_EQUALS,
        CondOperator.GREATER_THAN,
        CondOperator.LOWER_THAN_EQUALS,
        CondOperator.LOWER_THAN,
    ],
    [FilterKeyType.Boolean]: [CondOperator.NOT_EQUALS, CondOperator.EQUALS],
    [FilterKeyType.Existence]: [CondOperator.NOT_NULL, CondOperator.IS_NULL],
};
