import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import { isNil } from 'lodash';

export function adjustUTCToTimezone(dateTime: string, timezone: string) {
    if (isNil(dateTime)) {
        return dateTime;
    }
    const date = moment(dateTime);
    const offset = momentTimezone.tz.zone(timezone).utcOffset(date.valueOf());
    return date.subtract(offset, 'minutes').toISOString();
}

export function adjustTimezoneToUTC(dateTime: string, timezone: string) {
    if (isNil(dateTime)) {
        return dateTime;
    }

    const dateAndZone = moment.parseZone(dateTime);
    if (dateAndZone.utcOffset() !== 0) {
        // The date already has an offset so we can return the UTC version of
        // this date instead of adjusting it manually.
        return momentTimezone(dateAndZone).tz('UTC').toISOString();
    }

    const date = moment(dateTime);
    const offset = momentTimezone.tz.zone(timezone).utcOffset(date.valueOf());
    return date.add(offset, 'minutes').toISOString();
}

export function convertToIsoString(dateStr: string): string {
    if (moment(dateStr, moment.ISO_8601, true).isValid()) {
        return dateStr;
    }
    return momentTimezone(dateStr).tz('UTC').toISOString();
}
