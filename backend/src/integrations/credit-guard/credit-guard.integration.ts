import { Logger } from '@logger';
import { ICreditGuardCredentials } from '@config/payment';
import { CreditGuardToken } from '@entities';

export enum CreditGuardIntegrationType {
    RP = 'RP',
    ATG = 'ATG',
}

export abstract class CreditGuardIntegration {
    protected logger = Logger.instance;
    abstract type: CreditGuardIntegrationType;
    abstract credentials: ICreditGuardCredentials;

    abstract async requestToken(accountId: number, uniqueRef: string): Promise<string>;

    abstract async chargeToken(token: CreditGuardToken, amount: string, reference: string, cvv: string);
}
