import { Transform } from 'class-transformer';
import { asRegistrationNumber } from '@modules/shared/helpers/dto-transforms';

export function RegistrationNumber(): PropertyDecorator {
    return Transform((value) => asRegistrationNumber(value));
}
