export enum IssuerProviderType {
    None = 'None',
    ATG = 'ATG',
    Jerusalem = 'Jerusalem',
    Telaviv = 'Telaviv',
    Mileon = 'Mileon',
    Metropark = 'Metropark',
    KfarSaba = 'KfarSaba',
    Police = 'Police',
}
export class IssuerIntegrationDetailsModel {
    type: IssuerProviderType;
    verificationProvider: IssuerProviderType;
    code?: string;
}
