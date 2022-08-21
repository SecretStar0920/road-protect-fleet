import { isNaN, isNil, isString, omitBy, toInteger } from 'lodash';
import * as moment from 'moment';
import { BigNumber } from 'bignumber.js';
import { adjustTimezoneToUTC } from '@modules/shared/helpers/timezone-conversion';
import { fixDate } from '@modules/shared/helpers/fix-date';

/**
 * Removed dashes and spaces from vehicles
 */
export function vehicleRegistrationFormat(val) {
    if (!isNil(val) && isString(val)) {
        // Replaces non-characters with empty string (Requirement from @Veronika in the past)
        // @Liam is very concerned we are destroying information with this potentially
        return val.replace(/([^\da-zA-Z])/g, '');
    } else {
        return val;
    }
}

/**
 * Sometimes values come in as numbers but we expect string, so we transform to prevent auto inference
 */
export function asString(val) {
    return val ? `${val}` : val;
}

/**
 * Trim leading and trailing spaces
 */
export function trimString(val) {
    if (!isNil(val) && isString(val)) {
        return val.trim();
    } else {
        return val;
    }
}

export function asInteger(val) {
    return toInteger(val);
}

export function asBoolean(val): boolean {
    if (val === true || val === false) {
        return val;
    }
    if (isString(val)) {
        val = val.toUpperCase();
    }
    switch (val) {
        case 1:
        case '1':
        case 'TRUE':
        case 'YES':
            return true;
        case 0:
        case '0':
        case 'FALSE':
        case 'NO':
            return false;
        default:
            return false;
    }
}

/**
 * Timestamps that come in without a timezone get adjusted optionally to a timezone on the obj.timezone key provided
 */
export function timezoneAdjustToUTC(val, obj) {
    if (isNil(val)) {
        return val;
    }
    if (!isNil(obj.timezone) && moment.parseZone(val).utcOffset() === 0) {
        // This is for when there is a timezone sent in but the date doesn't
        // have an offset on it (ie. there isn't a timezone on the date)
        return adjustTimezoneToUTC(val, obj.timezone);
    } else if (moment.parseZone(val).utcOffset() !== 0) {
        // This is for when there is a timezone on the date and we want to
        // convert it to UTC because the offset will be there.
        return adjustTimezoneToUTC(val, obj.timezone);
    } else {
        return fixDate(val, obj.timezone);
    }
}

export function omitNull<T = any>(obj: T): T {
    return omitBy(obj, isNil) as T;
}

/**
 * Converts a number or number string to a 2 decimal formatted currency
 */
export function asCurrency(val) {
    const currency: BigNumber = new BigNumber(val);
    if (!currency.isNaN()) {
        return currency.toFixed(2);
    }
    return val;
}

export function asNoticeNumber(noticeNumber: string) {
    if (!noticeNumber) {
        return '';
    }
    noticeNumber = noticeNumber.toString();
    const filterOutSpecialCharacters = noticeNumber.replace(/[^0-9]/g, '');

    const convertedNumber = Number(filterOutSpecialCharacters);
    if (isNaN(convertedNumber)) {
        return '';
    }
    return convertedNumber.toString();
}

/**
 * This is exactly the same as the `asNoticeNumber` function but I want them
 * to be separate because the rules between these two transforms may not always
 * be the same.
 * @param registrationNumber
 */
export function asRegistrationNumber(registrationNumber: string) {
    if (!registrationNumber) {
        return null;
    }
    registrationNumber = registrationNumber.toString();
    const filterOutSpecialCharacters = registrationNumber.replace(/[^0-9]/g, '');

    const convertedNumber = Number(filterOutSpecialCharacters);
    if (isNaN(convertedNumber)) {
        return null;
    }
    if (convertedNumber === 0) {
        return null;
    }
    return convertedNumber.toString();
}
