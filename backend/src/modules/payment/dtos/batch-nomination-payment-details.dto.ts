import { IsInt } from 'class-validator';

export class BatchNominationPaymentDetailsDto {
    @IsInt({ each: true })
    nominationIds: number[];
}
