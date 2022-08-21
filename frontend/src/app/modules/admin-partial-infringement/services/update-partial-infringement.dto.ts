import { IsDefined } from 'class-validator';

export class UpdatePartialInfringementDto {
    @IsDefined()
    details: any;
}
