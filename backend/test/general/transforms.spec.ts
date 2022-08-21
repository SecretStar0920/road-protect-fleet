import { plainToClass } from 'class-transformer';
import { isEqual } from 'lodash';
import { Trim } from '../../src/modules/shared/helpers/trim.transform';

class TestDto {
    @Trim()
    testString: string;
}

describe('Transforms', () => {
    describe('@Trim', () => {
        it('Should trim strings', () => {
            const expected = 'HELLO';
            const testString = `    ${expected}   `;
            const dto = plainToClass(TestDto, { testString });
            expect(dto.testString).toBe(expected);
        });

        it('Should return null if the value is null', () => {
            const testString = null;
            const dto = plainToClass(TestDto, { testString });
            expect(dto.testString).toBe(testString);
        });

        it('Should return a number if the value is a number', () => {
            const testString = 1;
            const dto = plainToClass(TestDto, { testString });
            expect(dto.testString).toBe(testString);
        });

        it('Should return an object if the value is an object', () => {
            const testString = { hello: 'hello' };
            const dto = plainToClass(TestDto, { testString });
            expect(isEqual(testString, dto.testString)).toBeTruthy();
        });
    });
});
