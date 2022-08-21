import { isNil, isString } from 'lodash';
import * as moment from 'moment';
import * as ct from 'countries-and-timezones';
import { BigNumber } from 'bignumber.js';

/**
 * Removed dashes and spaces from vehicles
 */
export function vehicleRegistrationFormat(val) {
    if (!isNil(val) && isString(val)) {
        return val.replace(/ /g, '').replace(/-/g, '');
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
 * Timestamps that come in without a timezone get adjusted optionally to a timezone on the obj.timezone key provided
 */
export function timezoneAdjust(val, obj) {
    if (!isNil(obj.timezone) && moment.parseZone(val).utcOffset() === 0) {
        return moment(val).subtract(ct.getTimezone(obj.timezone).utcOffset, 'minutes').toISOString();
    } else {
        return moment(val).toISOString();
    }
}

/**
 * Converts a number or number string to a 2 decimal formatted currency
 */
export function asCurrency(val) {
    return new BigNumber(val).toFixed(2);
}
