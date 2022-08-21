export const requestInformationConfig = {
    //    Contract cutoff in months (for which accounts are included in the information request list)
    contractCutoffInMonthsForIncludedAccounts: 6,
    fromEmailAddress: process.env.REQUEST_INFORMATION_FROM_EMAIL_ADDRESS || 'muni@roadprotect.co.il',
};
