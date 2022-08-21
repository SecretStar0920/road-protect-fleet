import { IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentCvvDetails } from '@modules/payment/dtos/batch-municipal-pay-nominations.dto';

export class MunicipallyPayNominationDto {
    @IsDefined()
    @Type(() => PaymentCvvDetails)
    cvv: PaymentCvvDetails;
}
