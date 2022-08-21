import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BankingDetails } from '@modules/shared/models/entities/banking-details.model';

export class IssuerDetails {
    @ValidateNested()
    @Type(() => BankingDetails)
    banking: BankingDetails;
}
