import { IsDefined } from 'class-validator';

export class CreatePartialInfringementDto {
    @IsDefined()
    details: any;
}
