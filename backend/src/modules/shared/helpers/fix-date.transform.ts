import { Transform } from 'class-transformer';
import { fixDate } from '@modules/shared/helpers/fix-date';
import * as moment from 'moment';
import { Config } from '@config/config';

function getYear(date: string): number {
    const yearRegex = /^(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    if (yearRegex.test(date)) {
        const matches = yearRegex.exec(date);
        const [full, year, month, day, hour, minute, second] = matches;
        return Number(year);
    }
    return null;
}
/**
 * Fixes a date and removes very old dates
 * @param returnNull Whether or not null should be returned if the date cannot
 * be parsed (ie. if the date doesn't match any regex patterns
 * @param useMinimumDateConstraint Whether we should try to kick out old dates, ie. Use the
 * minimum date constraint
 * @constructor
 */
export function FixDate(returnNull = true, useMinimumDateConstraint = true): PropertyDecorator {
    return Transform((value, obj) => {
        const fixedDate = fixDate(value, obj.timezone, returnNull);

        if (!fixedDate) {
            return fixedDate;
        }

        if (!useMinimumDateConstraint) {
            return fixedDate;
        }

        // Try string comparison
        const year = getYear(fixedDate);
        if (year !== null && year < Config.get.app.minimumYear) {
            return null;
        }

        // At this point the string comparison failed, so now I'm going to use
        // moment to parse the date
        const date = moment(fixedDate);
        if (!date.isValid()) {
            return fixedDate;
        }

        if (date.isBefore(moment(Config.get.app.minimumDate))) {
            return null;
        }

        return fixedDate;
    });
}
