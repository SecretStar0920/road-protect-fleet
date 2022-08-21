import { fixDate } from '@modules/shared/helpers/fix-date';
import { Config } from '@config/config';
import * as moment from 'moment';

describe(`Date conversion tests`, () => {
    it(`Formats dates from ATG correctly  `, () => {
        const date = fixDate('2019-10-15T09:43:00+03:00', Config.get.app.timezone, true);
        expect(moment(date).isValid()).toBeTruthy();
        expect(moment(date).toISOString()).toBe('2019-10-15T06:43:00.000Z');
    });
});
