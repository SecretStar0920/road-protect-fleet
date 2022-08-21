import { NotFutureOffenceDate } from '@modules/shared/validators/not-future-offence-date.validator';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import * as moment from 'moment';

class FutureDateDto {
    @NotFutureOffenceDate()
    date: string;
}

describe(`Not future date validator`, () => {
    it(`Does not fail dates in the past`, async () => {
        const dto = plainToClass(FutureDateDto, {
            date: '2020-01-01',
        });
        const validation = await validate(dto);
        expect(validation.length).toBe(0);
    });

    it(`Does not fail dates from now`, async () => {
        const dto = plainToClass(FutureDateDto, {
            date: moment().toISOString(),
        });
        const validation = await validate(dto);
        expect(validation.length).toBe(0);
    });

    it(`Does fail dates from after now`, async () => {
        const dto = plainToClass(FutureDateDto, {
            date: moment().add(1, 'minute').toISOString(),
        });
        const validation = await validate(dto);
        expect(validation.length).toBe(1);
        expect(validation[0].constraints.offenceDate).toContain('is in the future');
    });

    it(`Does fail dates for far after now`, async () => {
        const dto = plainToClass(FutureDateDto, {
            date: moment().add(1, 'year').toISOString(),
        });
        const validation = await validate(dto);
        expect(validation.length).toBe(1);
        expect(validation[0].constraints.offenceDate).toContain('is in the future');
    });

    it(`Does not fail if the date is null`, async () => {
        const dto = plainToClass(FutureDateDto, {
            date: null,
        });
        const validation = await validate(dto);
        expect(validation.length).toBe(0);
    });

    it(`Does not fail on invalid date`, async () => {
        const dto = plainToClass(FutureDateDto, {
            date: 'invalid',
        });
        const validation = await validate(dto);
        expect(validation.length).toBe(0);
    });
});
