import { AtgCreditGuardIntegration } from '@integrations/credit-guard/atg-credit-guard.integration';
import { RpCreditGuardIntegration } from '@integrations/credit-guard/rp-credit-guard.integration';
import { CreditGuardIntegrationType } from '@integrations/credit-guard/credit-guard.integration';

export const CREDIT_GUARD_INTEGRATION_MAP = {
    [CreditGuardIntegrationType.ATG]: new AtgCreditGuardIntegration(),
    [CreditGuardIntegrationType.RP]: new RpCreditGuardIntegration(),
};
