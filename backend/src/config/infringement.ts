export enum InfringementVerificationProvider {
    None = 'none',
    ATG = 'ATG',
    Jerusalem = 'jerusalem-crawler',
    Telaviv = 'telaviv-crawler',
    Metropark = 'metropark-crawler',
    KfarSaba = 'kfarSaba-crawler',
    Police = 'police',
    Shohar = 'shohar-crawler',
    Mileon = 'mileon-crawler',
    City4u = 'city4u-crawler',
}

export const infringement = {
    /**
     * The number of days to add to an offence date to calculate the payment
     * date if one is not specified.
     */
    defaultPaymentDays: 60,
    /**
     * The name of the client saved on the database for manual uploads
     */
    infringementUploadClientName: 'manual-upload',
    /**
     * Infringement providers with available verify integrations
     */
    verifiableProviders: {
        atg: InfringementVerificationProvider.ATG,
        jerusalem: InfringementVerificationProvider.Jerusalem,
        telaviv: InfringementVerificationProvider.Telaviv,
        mileon: InfringementVerificationProvider.Mileon,
        metropark: InfringementVerificationProvider.Metropark,
        kfarSaba: InfringementVerificationProvider.KfarSaba,
        police: InfringementVerificationProvider.Police,
        shohar: InfringementVerificationProvider.Shohar,
        city4u: InfringementVerificationProvider.City4u,
    },
    /**
     * The amounts that will automatically trigger the reduction of the original amount if the due amount is less than the original amount
     */
    adjustOriginalAmount: {
        levelOne: '100',
        levelTwo: '250',
        levelThree: '500',
        levelFour: '1000',
    },
};
