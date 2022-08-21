import { isString, isNumber, isNil } from 'lodash';
import * as momentTimezone from 'moment-timezone';
import { Config } from '@config/config';

/**
 * Used to pad strings with a certain character. For example:
 * pad('3', 2, '0') ---> '03'
 * @param str The string we want to pad
 * @param length The target length
 * @param padChar The character to pad with
 */
function pad(str: string, length = 2, padChar = '0') {
    if (str.length >= length) {
        return str;
    }
    const diff = length - str.length;
    let result = str;
    for (let i = 0; i < diff; i++) {
        result = `${padChar}${result}`;
    }
    return result;
}

function getTimezoneOffset(timezone: string, dateOnly: string = '') {
    if (!timezone) {
        return 'Z';
    }
    return dateOnly.length > 0
        ? momentTimezone(dateOnly).tz(timezone).isValid()
            ? momentTimezone(dateOnly).tz(timezone).format('Z').replace(':', '')
            : 'Z'
        : momentTimezone().tz(timezone).isValid()
        ? momentTimezone().tz(timezone).format('Z').replace(':', '')
        : 'Z';
}

function isInvalidYear(year: string | number) {
    return Number(year) < Config.get.app.minimumYear;
}

const patterns: DateTimePattern[] = [
    {
        example: '30/08/2020 10:08',
        regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) +(\d{1,2}):(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, day, month, year, hour, minute] = matches;
            return { full, day, month, year, hour, minute };
        },
    },
    {
        example: '30/08/2020 10:08:00',
        regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) +(\d{1,2}):(\d{1,2}):(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, day, month, year, hour, minute, second] = matches;
            return { full, day, month, year, hour, minute, second };
        },
    },
    {
        example: '30/08/2020',
        regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        matchExtractor: (matches) => {
            const [full, day, month, year] = matches;
            return { full, day, month, year };
        },
    },
    {
        example: '2020/08/30 10:08',
        regex: /^(\d{4})\/(\d{1,2})\/(\d{1,2}) +(\d{1,2}):(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, year, month, day, hour, minute] = matches;
            return { full, day, month, year, hour, minute };
        },
    },
    {
        example: '2020/08/30 10:08:00',
        regex: /^(\d{4})\/(\d{1,2})\/(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, year, month, day, hour, minute, second] = matches;
            return { full, day, month, year, hour, minute, second };
        },
    },
    {
        example: '2020/08/30',
        regex: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, year, month, day] = matches;
            return { full, day, month, year };
        },
    },
    {
        example: '2020-08-30',
        regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, year, month, day] = matches;
            return { full, day, month, year };
        },
    },
    {
        example: '2020-08-30 10:08',
        regex: /^(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, year, month, day, hour, minute] = matches;
            return { full, day, month, year, hour, minute };
        },
    },
    {
        example: '2020-08-30 10:08:01',
        regex: /^(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, year, month, day, hour, minute, second] = matches;
            return { full, day, month, year, hour, minute, second };
        },
    },
    {
        example: '30-08-2020',
        regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
        matchExtractor: (matches) => {
            const [full, day, month, year] = matches;
            return { full, day, month, year };
        },
    },
    {
        example: '30-08-2020 10:08',
        regex: /^(\d{1,2})-(\d{1,2})-(\d{4}) +(\d{1,2}):(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, day, month, year, hour, minute] = matches;
            return { full, day, month, year, hour, minute };
        },
    },
    {
        example: '30-08-2020 10:08:01',
        regex: /^(\d{1,2})-(\d{1,2})-(\d{4}) +(\d{1,2}):(\d{1,2}):(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, day, month, year, hour, minute, second] = matches;
            return { full, day, month, year, hour, minute, second };
        },
    },
    {
        example: '10:02 2020/08/30',
        regex: /^(\d{1,2}):(\d{1,2}) (\d{4})\/(\d{1,2})\/(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, hour, minute, year, month, day] = matches;
            return { full, day, month, year, hour, minute };
        },
    },
    {
        example: '10:02:33 2020/08/30',
        regex: /^(\d{1,2}):(\d{1,2}):(\d{1,2}) (\d{4})\/(\d{1,2})\/(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, hour, minute, second, year, month, day] = matches;
            return { full, day, month, year, hour, minute, second };
        },
    },
    {
        example: '10:02 30/08/2020',
        regex: /^(\d{1,2}):(\d{1,2}) (\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        matchExtractor: (matches) => {
            const [full, hour, minute, day, month, year] = matches;
            return { full, day, month, year, hour, minute };
        },
    },
    {
        example: '10:02:33 30/08/2020',
        regex: /^(\d{1,2}):(\d{1,2}):(\d{1,2}) (\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        matchExtractor: (matches) => {
            const [full, hour, minute, second, day, month, year] = matches;
            return { full, day, month, year, hour, minute, second };
        },
    },
    {
        example: '10:02 2020-08-30',
        regex: /^(\d{1,2}):(\d{1,2}) (\d{4})-(\d{1,2})-(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, hour, minute, year, month, day] = matches;
            return { full, day, month, year, hour, minute };
        },
    },
    {
        example: '10:02:33 2020-08-30',
        regex: /^(\d{1,2}):(\d{1,2}):(\d{1,2}) (\d{4})-(\d{1,2})-(\d{1,2})$/,
        matchExtractor: (matches) => {
            const [full, hour, minute, second, year, month, day] = matches;
            return { full, day, month, year, hour, minute, second };
        },
    },
    {
        example: '10:02 30-08-2020',
        regex: /^(\d{1,2}):(\d{1,2}) (\d{1,2})-(\d{1,2})-(\d{4})$/,
        matchExtractor: (matches) => {
            const [full, hour, minute, day, month, year] = matches;
            return { full, day, month, year, hour, minute };
        },
    },
    {
        example: '10:02 30-08-2020',
        regex: /^(\d{1,2}):(\d{1,2}):(\d{1,2}) (\d{1,2})-(\d{1,2})-(\d{4})$/,
        matchExtractor: (matches) => {
            const [full, hour, minute, second, day, month, year] = matches;
            return { full, day, month, year, hour, minute, second };
        },
    },
];

export interface DateTimePattern {
    example?: string;
    regex: RegExp;
    matchExtractor: (
        matches: string[],
    ) => {
        full?: string;
        hour?: string;
        minute?: string;
        second?: string;
        day?: string;
        month?: string;
        year?: string;
    };
}

export class DateTimePatternMatcher {
    static create(expectedPatterns: DateTimePattern[]) {
        return new DateTimePatternMatcher(expectedPatterns);
    }

    constructor(private expectedPatterns: DateTimePattern[]) {}

    /**
     * Tries to match the input to one of the patterns, if it
     * doesn't fine a match, it will return null
     * @param input The input
     * @param timezone The timezone to add to theoutput
     */
    match(input: string, timezone: string): string | null {
        for (const expectedPattern of this.expectedPatterns) {
            const matches = expectedPattern.regex.exec(input);
            if (!matches || !matches.length) {
                continue;
            }
            const datetimeData = expectedPattern.matchExtractor(matches);
            if (isInvalidYear(datetimeData.year)) {
                return null;
            }
            const dateOnly = `${datetimeData.year}-${pad(datetimeData.month)}-${pad(datetimeData.day)}`;
            return `${dateOnly}T${pad(datetimeData.hour || '0')}:${pad(datetimeData.minute || '0')}:${pad(
                datetimeData.second || '0',
            )}${getTimezoneOffset(timezone, dateOnly)}`;
        }
        return null;
    }
}

/**
 * There are some instances where we need to fix the date because it's a date
 * string but is missing "formatting" that we could fix and therefore it would
 * not fail the transformation. We return this date as a UTC date.
 * @param dateStr The incoming date string.
 * @param timezone The timezone
 * @param returnNull Whether to return null if it was invalid
 */
export function fixDate(dateStr, timezone = null, returnNull = false) {
    if (isNil(dateStr)) {
        return returnNull ? null : dateStr;
    }

    // Check to see if this is a string, if not, we'll return it straight away
    // because then it's not a raw date
    if (!isString(dateStr)) {
        return returnNull ? null : dateStr;
    }

    // At this point, the date is a string.
    // We trim any whitespace
    dateStr = dateStr.trim();
    if (dateStr === '') {
        return returnNull ? null : dateStr;
    }

    // ISO Date
    // 2020-08-30T11:59:00+0300
    // 2020-08-30T11:59:00Z
    // 2021-03-24T09:23:18.114Z
    const standardIso = /^\d{1,4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}\+\d{1,4}$/;
    const standardIso2 = /^\d{1,4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}\+\d{2}:\d{2}$/;
    const standardIsoUtc = /^\d{1,4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}Z$/;
    const standardIsoMillisecondsUtc = /^\d{1,4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}\.\d+Z$/;

    if (
        standardIso.test(dateStr) ||
        standardIsoUtc.test(dateStr) ||
        standardIsoMillisecondsUtc.test(dateStr) ||
        standardIso2.test(dateStr)
    ) {
        return dateStr;
    }

    const matchedDate = DateTimePatternMatcher.create(patterns).match(dateStr, timezone || Config.get.app.timezone);

    return matchedDate ? matchedDate : returnNull ? null : dateStr;
}
