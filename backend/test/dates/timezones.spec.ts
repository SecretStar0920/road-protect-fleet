import { fixDate } from '@modules/shared/helpers/fix-date';

describe('Timezone Tests', () => {
    const TIMEZONES = {
        ISRAEL: 'Asia/Tel_Aviv',
    };

    it('converts a simple date to an ISO format', () => {
        const simpleDate = '2020-01-01';
        const fixed = fixDate(simpleDate, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T00:00:00+0200`);
    });

    it('converts a simple date to an ISO format with daylight savings', () => {
        const simpleDate = '2020-06-01';
        const fixed = fixDate(simpleDate, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-06-01T00:00:00+0300`);
    });

    it('converts a simple datetime to an ISO format', () => {
        const simpleDate = '2020-01-01 10:00';
        const fixed = fixDate(simpleDate, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:00+0200`);
    });

    it('converts a simple datetime with seconds to an ISO format', () => {
        const simpleDate = '2020-01-01 10:00:01';
        const fixed = fixDate(simpleDate, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:01+0200`);
    });

    it('converts a day first simple date to an ISO format', () => {
        const simpleDate = '01-01-2020';
        const fixed = fixDate(simpleDate, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T00:00:00+0200`);
    });

    it('converts a day first simple datetime to an ISO format', () => {
        const simpleDate = '01-01-2020 10:00';
        const fixed = fixDate(simpleDate, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:00+0200`);
    });

    it('converts a day first simple datetime with seconds to an ISO format', () => {
        const simpleDate = '01-01-2020 10:00:01';
        const fixed = fixDate(simpleDate, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:01+0200`);
    });

    it('converts a forward-slash date to an ISO format', () => {
        const date = '01/01/2020';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T00:00:00+0200`);
    });

    it('converts a forward-slash datetime to an ISO format', () => {
        const date = '01/01/2020 10:00';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:00+0200`);
    });

    it('converts a forward-slash datetime with seconds to an ISO format', () => {
        const date = '01/01/2020 10:00:01';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:01+0200`);
    });

    it('converts a forward-slash date with year first to an ISO format', () => {
        const date = '2020/01/01';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T00:00:00+0200`);
    });

    it('converts a forward-slash timedate to an ISO format', () => {
        const date = '10:00 01/01/2020';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:00+0200`);
    });

    it('converts a forward-slash timedate with seconds to an ISO format', () => {
        const date = '10:00:01 01/01/2020';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:01+0200`);
    });

    it('converts a forward-slash timedate to an ISO format', () => {
        const date = '10:00 2020/01/01';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:00+0200`);
    });

    it('converts a forward-slash timedate with seconds to an ISO format', () => {
        const date = '10:00:01 2020/01/01';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:01+0200`);
    });

    it('converts a dash timedate to an ISO format', () => {
        const date = '10:00 01-01-2020';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:00+0200`);
    });

    it('converts a dash timedate with seconds to an ISO format', () => {
        const date = '10:00:01 01-01-2020';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:01+0200`);
    });

    it('converts a dash timedate to an ISO format', () => {
        const date = '10:00 2020-01-01';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:00+0200`);
    });

    it('converts a dash timedate with seconds to an ISO format', () => {
        const date = '10:00:01 2020-01-01';
        const fixed = fixDate(date, TIMEZONES.ISRAEL);
        expect(fixed).toBe(`2020-01-01T10:00:01+0200`);
    });
});
