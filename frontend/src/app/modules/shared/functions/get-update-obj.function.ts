import { forEach, isEqual, isObject, cloneDeep, isNil, isEmpty } from 'lodash';
import * as moment from 'moment';

export function getChangedObject<T>(orig: any, updated: any): Partial<T> {
    const changes: any = {};

    forEach(orig, (value, key) => {
        if (Array.isArray(orig[key]) && Array.isArray(updated[key])) {
            if (!isEqual(orig[key], updated[key])) {
                changes[key] = updated[key];
                return;
            }
        }

        if (typeof key === 'string' && key.includes('Date')) {
            if (!moment(orig[key]).isSame(moment(updated[key]))) {
                changes[key] = updated[key];
                return;
            }
        }
        if (isObject(orig[key]) && isObject(updated[key])) {
            const recursiveChanged = getChangedObject(orig[key], updated[key]);
            if (!isEmpty(recursiveChanged)) {
                changes[key] = recursiveChanged;
            }
            return;
        }


        if (!isEqual(orig[key], updated[key])) {
            changes[key] = updated[key];
            return;
        }
    });
    return changes;
}

export function recursivelyRemoveNilKeys(object: any): any {
    const clonedObject = cloneDeep(object);

    for (const key of Object.keys(clonedObject)) {
        if (isObject(clonedObject[key])) {
            clonedObject[key] = recursivelyRemoveNilKeys(clonedObject[key]);
        }
        if (isNil(clonedObject[key]) || isEmpty(clonedObject[key])) {
            delete clonedObject[key];
        }
    }
    return clonedObject;
}
