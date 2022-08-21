import { IsDefined, IsIn } from 'class-validator';
import { CreditGuardIntegrationType } from '@integrations/credit-guard/credit-guard.integration';

export class TokenisationParamsDto {
    @IsIn(Object.values(CreditGuardIntegrationType))
    type: CreditGuardIntegrationType;
    @IsDefined()
    accountId: number;
}
