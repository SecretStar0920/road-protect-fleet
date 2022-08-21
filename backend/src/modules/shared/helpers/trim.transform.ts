import { Transform } from 'class-transformer';

export function Trim(): PropertyDecorator {
    return Transform((value: string) => (typeof value === 'string' ? value.trim() : value));
}

export function TrimLeadingZeros(): PropertyDecorator {
    return Transform((value: string) => (typeof value === 'string' ? value.replace(/^0+/g, '') : value));
}
