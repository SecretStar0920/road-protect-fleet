import { forEach, isObject } from 'lodash';

export function ObjectPaths(object: any) {
    const result = {};

    function flattenObj(obj, prefix = '') {
        forEach(obj, (value, key) => {
            if (isObject(value)) {
                flattenObj(value, `${prefix}${key}.`);
            } else {
                result[`${prefix}${key}`] = value;
            }
        });
    }

    flattenObj(object);
    return result;
}
