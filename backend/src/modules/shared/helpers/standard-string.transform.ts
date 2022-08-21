import { Transform } from 'class-transformer';
import { isNull, isNil } from 'lodash';

function ignoreZero(input: string): string {
    return input === '0' ? '' : input;
}

function ignoreSpecialCharacters(input: string): string {
    input = input.replace(/\r\n/g, '');
    input = input.replace(/\t/g, '');
    input = input.replace(/\n/g, '');
    return input;
}

export interface StandardStringOptions {
    /**
     * Remove leading and trailing whitespace and new lines
     */
    trim: boolean;
    /**
     * If it's just a '0' then ignore it (make this equivalent to null)
     */
    ignoreZero: boolean;
    /**
     * If it is null, then return null instead of an empty string
     */
    returnNull: boolean;
    /**
     * Remove special characters like new lines, tabs, etc
     */
    removeSpecialCharacters: boolean;
}

const defaultOptions: StandardStringOptions = {
    trim: true,
    ignoreZero: true,
    returnNull: true,
    removeSpecialCharacters: true,
};

/**
 * Transforms a string to match the conventions that we think are necessary for
 * most strings in the system.
 * @param options The options that can be used to modify how this transform
 * changes
 * @constructor
 */
export function StandardString(options: Partial<StandardStringOptions> = defaultOptions): PropertyDecorator {
    const finalOptions: StandardStringOptions = { ...defaultOptions, ...options };
    return Transform((value: unknown) => {
        if (finalOptions.returnNull && isNull(value)) {
            return value;
        }
        if (isNil(value)) {
            return finalOptions.returnNull ? null : '';
        }
        let finalValue: string = (value || '').toString();
        finalValue = finalOptions.trim ? finalValue.trim() : finalValue;
        finalValue = finalOptions.ignoreZero ? ignoreZero(finalValue) : finalValue;
        finalValue = finalOptions.removeSpecialCharacters ? ignoreSpecialCharacters(finalValue) : finalValue;
        return finalValue;
    });
}
