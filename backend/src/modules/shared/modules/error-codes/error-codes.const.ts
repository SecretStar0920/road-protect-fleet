import { NominationStatus } from '@modules/shared/models/nomination-status';

export const ERROR_CODES: { [key: string]: { message: (context?: object) => string; code: string } } = {
    E001_AsyncStoreNotDefined: {
        message: () => `E001: Store undefined but requested, most likely the [async context is missing]`,
        code: `E001`,
    },
    E002_CouldNotFindAccountRelationDocumentToDelete: {
        message: () => `E002: Could not find the Account Relation Document to delete`,
        code: `E002`,
    },
    E003_CouldNotFindGeneratedDocumentToDelete: { message: () => `E003: Could not find the Generated Document to delete`, code: `E003` },
    E004_CouldNotFindInfringementNoteToDelete: { message: () => `E004: Could not find the Infringement Note to delete`, code: `E004` },
    E005_CouldNotFindDocumentTemplateToDelete: { message: () => `E005: Could not find the Document Template to delete`, code: `E005` },
    E006_CouldNotFindAccountRelationToDelete: { message: () => `E006: Could not find the Account Relation to delete`, code: `E006` },
    E007_CouldNotFindTargetResourceToAddDocumentTo: {
        message: () => `E007: Could not find the target resource to add this document to`,
        code: `E007`,
    },
    E008_CouldNotFindDocumentToLink: { message: () => `E008: Could not find the document to link`, code: `E008` },
    E009_ScheduledCrawlerNowFound: { message: () => `E009: Scheduled crawler not found`, code: `E009` },
    E010_InvalidAPIUserLogin: { message: () => `E010: Invalid API user login details`, code: `E010` },
    E011_CouldNotFindInfringementNote: {
        message: (context: { infringementNoteId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E011: Could not find InfringementNote with id: {infringementNoteId}`;
            }
            return `E011: Could not find InfringementNote with id: ${context.infringementNoteId}`;
        },
        code: `E011`,
    },
    E012_CouldNotFindAccountRelation: {
        message: (context: { accountRelationId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E012: Could not find AccountRelation with id: {accountRelationId}`;
            }
            return `E012: Could not find AccountRelation with id: ${context.accountRelationId}`;
        },
        code: `E012`,
    },
    E013_CouldNotMergeFile: {
        message: (context: { fileName: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E013: Could not merge {fileName}`;
            }
            return `E013: Could not merge ${context.fileName}`;
        },
        code: `E013`,
    },
    E014_CouldNotFindAccountRelationDocument: {
        message: (context: { accountRelationDocumentId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E014: Could not find AccountRelationDocument with id: {accountRelationDocumentId}`;
            }
            return `E014: Could not find AccountRelationDocument with id: ${context.accountRelationDocumentId}`;
        },
        code: `E014`,
    },
    E015_CouldNotFindDocumentTemplate: {
        message: (context?: { documentTemplateId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return 'E015: Could not find the document template requested';
            } else
                return context
                    ? `E015: Could not find DocumentTemplate with id: ${context.documentTemplateId}`
                    : 'E015: Could not find the document template requested';
        },
        code: `E015`,
    },
    E016_CouldNotFindGeneratedDocument: {
        message: (context: { generatedDocumentId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E016: Could not find GeneratedDocument with id: {generatedDocumentId}`;
            }
            return `E016: Could not find GeneratedDocument with id: ${context.generatedDocumentId}`;
        },
        code: `E016`,
    },
    E017_RequiredMileonCodeForIssuer: {
        message: (context: { issuerId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E017: Required external Mileon code for verification but none found for issuer id {issuerId}`;
            }
            return `E017: Required external Mileon code for verification but none found for issuer id ${context.issuerId}`;
        },
        code: `E017`,
    },
    E018_UnexpectedEmptyResponseFromCrawler: {
        message: (context: { noticeNumber: string; crawler: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E018: Received unexpected empty response from {crawler} crawler for notice number {noticeNumber}`;
            }
            return `E018: Received unexpected empty response from ${context.crawler} crawler for notice number ${context.noticeNumber}`;
        },
        code: `E018`,
    },
    E019_ForwardAccountNotFound: {
        message: () => `E019: Primary / Forward account not found`,
        code: `E019`,
    },
    E020_CouldNotFindNomination: {
        message: (context?: { nominationId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E020: Could not find the nomination`;
            } else
                return context ? `E020: Could not find Nomination with id: ${context.nominationId}` : `E020: Could not find the nomination`;
        },
        code: `E020`,
    },
    E021_VehicleNotRelatedToAccount: {
        message: (context: { vehicleId: number; accountId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E021: The vehicle with id {vehicleId} is not related to account with id {accountId}`;
            }
            return `E021: The vehicle with id ${context.vehicleId} is not related to account with id ${context.accountId}`;
        },
        code: `E021`,
    },
    E022_ErrorFromCrawler: {
        message: (context: { crawler: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E022: Received an error from the {crawler} crawler`;
            }
            return `E022: Received an error from the ${context.crawler} crawler`;
        },
        code: `E022`,
    },
    E023_ReverseAccountNotFound: { message: () => `E023: Target / Reverse account not found`, code: `E023` },
    E024_CannotCreateRelationBetweenSameAccount: {
        message: () => `E024: Relation cannot be created between two accounts which are the same`,
        code: `E024`,
    },
    E025_ErrorFromContractOCR: { message: () => `E025: Received an error from the Contract OCR`, code: `E025` },
    E026_CouldNotFindAccount: {
        message: (context?: { accountId?: number | string; accountIdentifier?: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E026: Account not found`;
            } else if (context?.accountId) {
                return `E026: Could not find Account with id: ${context.accountId}`;
            } else if (context?.accountIdentifier) {
                return `E026: Account with identifier ${context.accountIdentifier} not found`;
            } else {
                return `E026: Account not found`;
            }
        },
        code: `E026`,
    },
    E027_NoRolesFound: { message: () => `E027: No Roles were found`, code: `E027` },
    E028_CouldNotFindAccountUserToDelete: { message: () => `E028: Could not find the account user to delete`, code: `E028` },
    E029_AccountUserNotFound: { message: () => `E029: Account User not found`, code: `E029` },
    E030_InvalidUploadedData: { message: () => `E030: The uploaded data is invalid`, code: `E030` },
    E031_CouldNotFindRole: {
        message: (context?: { roleName?: string; roleId?: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E031: Could not find Role`;
            } else if (context?.roleName) {
                return `E031: Could not fine Role: ${context.roleName}`;
            } else if (context?.roleId) {
                return `E031: Could not find Role with id: ${context.roleId}`;
            } else {
                return `E031: Could not find Role`;
            }
        },
        code: `E031`,
    },
    E032_UpdateNotSupported: { message: () => `E032: Update is not yet supported`, code: `E032` },
    E033_MethodNotSupportedORProvidedIncorrectly: {
        message: () => `E033: Method is not yet supported or has been provided incorrectly`,
        code: `E033`,
    },
    E034_CouldNotFindAccountToDelete: { message: () => `E034: Could not find the Account to delete`, code: `E034` },
    E035_CouldNotFindContractToDelete: { message: () => `E035: Could not find the Contract to delete`, code: `E035` },
    E036_DocumentDetailsDontMatchContract: { message: () => `E036: Document details do not match the contract details`, code: `E036` },
    E037_CouldNotFindInfringement: {
        message: (context?: { infringementId: number; generatingDocumentation?: boolean }) => {
            if (!!context?.generatingDocumentation) {
                return 'E037: Could not find the infringement provided';
            } else
                return context
                    ? `E037: Could not find Infringement with id: ${context.infringementId}`
                    : 'E037: Could not find the infringement provided';
        },
        code: `E037`,
    },
    E038_ProvidedDatesOverlapWithExistingContract: {
        message: () => `E038: Provided contract dates overlap with existing contract(s)`,
        code: `E038`,
    },
    E039_CouldNotFindLeaseContractToDelete: { message: () => `E039: Could not find the Lease Contract to delete`, code: `E039` },
    E040_NotAutocompletableField: { message: () => `E040: This field is not autocompletable`, code: `E040` },
    E041_NoFileUploadedToOCR: { message: () => `E041: No file uploaded to OCR`, code: `E041` },
    E042_NoLeaseContractToUpdate: { message: () => `E042: Could not find lease contract to update`, code: `E042` },
    E043_FailedToAddDocument: { message: () => `E043: Failed to add document`, code: `E043` },
    E044_CouldNotFindDocument: {
        message: (context?: { documentId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E044: Could not find the document requested`;
            } else
                return context
                    ? `E044: Could not find Document with id: ${context.documentId}`
                    : `E044: Could not find the document requested`;
        },
        code: `E044`,
    },
    E045_FailedToLoadDocument: { message: () => `E045: Failed to load the document requested`, code: `E045` },
    E046_FailedToCreateGeneratedDocument: { message: () => `E046: Failed to create a generated document`, code: `E046` },
    E047_CouldNotFindDocumentToDelete: { message: () => `E047: Could not find the Document to delete`, code: `E047` },
    E048_CrawlerSyncRequiresInfringementIssuedForTheVehicle: {
        message: (context: { crawler: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E048: To sync new infringements for a vehicle with ${context.crawler}, we need to have one ${context.crawler} issued infringement for that vehicle`;
            }
            return `E048: To sync new infringements for a vehicle with ${context.crawler}, we need to have one ${context.crawler} issued infringement for that vehicle`;
        },
        code: `E048`,
    },
    E049_CouldNotFindVehicle: {
        message: (context: { registration?: string | number; vehicleId?: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E049: Could not find Vehicle`;
            } else if (context.registration) {
                return `E049: Could not find Vehicle with registration ${context.registration}`;
            } else if (context.vehicleId) {
                return `E049: Could not find Vehicle with id: ${context.vehicleId}`;
            } else {
                return `E049: Could not find Vehicle`;
            }
        },
        code: `E049`,
    },
    E050_NoContractToUpdate: {
        message: (context?: { contractId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E050: Could not find contract to update`;
            } else return context ? `E050: Contract with id ${context.contractId} not found` : `E050: Could not find contract to update`;
        },
        code: `E050`,
    },
    E051_NonUniqueContractReference: {
        message: (context: { reference: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E051: More than one contract found with the same reference ({reference}), please ensure your contract reference is unique`;
            }
            return `E051: More than one contract found with the same reference (${context.reference}), please ensure your contract reference is unique`;
        },
        code: `E051`,
    },
    E052_NoContractFoundRelatingToAccount: {
        message: () => `E052: No contract found relating to your current account with that reference`,
        code: `E052`,
    },
    E053_CouldNotFindInfringementToDelete: { message: () => `E053: Could not find the Infringement to delete`, code: `E053` },
    E054_IncorrectLoginCredentials: { message: () => `E054: Incorrect login credentials`, code: `E054` },
    E055_CannotLoginAsAPIUser: { message: () => `E055: You cannot login as an API user`, code: `E055` },
    E056_MaxLoginAttempts: {
        message: (context: { loginAttempts: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E056: Maximum login attempts reached ({loginAttempts}), please speak to a system admin to unlock your account.`;
            }
            return `E056: Maximum login attempts reached (${context.loginAttempts}), please speak to a system admin to unlock your account.`;
        },
        code: `E056`,
    },
    E057_MissingIdentityReLogin: { message: () => `E057: Identity missing or expired, please re-login`, code: `E057` },
    E058_CouldNotChangeAccountNotFound: { message: () => `E058: Could not change account - account not found`, code: `E058` },
    E059_CouldNotReturnUpdatedInformation: {
        message: () => `E059: Could not return updated information, please contact a developer`,
        code: `E059`,
    },
    E060_UserNotFound: {
        message: (context?: { email?: string; userId?: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E060: User not found`;
            } else if (context.email) {
                return `E060: User with email: ${context.email} not found`;
            } else if (context.userId) {
                return `E060: Could not find user with id: ${context.userId}`;
            } else {
                return `E060: User not found`;
            }
        },
        code: `E060`,
    },
    E061_FailedToResetPasswordExpiredToken: {
        message: () => `E061: Failed to reset your password, your token may have expired`,
        code: `E061`,
    },
    E062_CannotSendResetPasswordEmailNotInSystem: {
        message: () => `E062: We cannot send a password reset email for the email address provided because it does not exist on our system`,
        code: `E062`,
    },
    E063_FailedToSendResetPasswordEmail: { message: () => `E063: Failed to send the email for your password reset`, code: `E063` },
    E064_DisabledUpdateAccountBRN: {
        message: () =>
            `E064: We have disabled the ability to update account BRNs to prevent data corruption. Please contact us so that we can make this change for you if it is intended`,
        code: `E064`,
    },
    E065_InsufficientAddressInformationNoExistingPostal: {
        message: () => `E065: No existing Postal Location and insufficient information to create complete address`,
        code: `E065`,
    },
    E066_InsufficientAddressInformationNoExistingPhysical: {
        message: () => `E066: No existing Physical Location and insufficient information to create complete address`,
        code: `E066`,
    },
    E067_NotPermittedToTakeActionOnAccount: {
        message: () =>
            `E067: You are not permitted to take actions on this account as you are not logged in on behalf of this account and the account is self-managed`,
        code: `E067`,
    },
    E068_MissingLoginDetails: { message: () => `E068: Missing login details, please re-login`, code: `E068` },
    E069_DontHavePermission: {
        message: (context?: { permission: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E069: You do not have the permissions required for this action`;
            }
            return context
                ? `E069: You do not have the permissions required for this action: ${context.permission}`
                : `E069: You do not have the permissions required for this action`;
        },
        code: `E069`,
    },
    E070_UseFrontendToPerformAction: { message: () => `E070: Please use the fleet frontend to perform that action`, code: `E070` },
    E071_MustBeSystemAdmin: { message: () => `E071: You must be a System Administrator to perform that action`, code: `E071` },
    E072_RoleCreationNotImplementedYet: {
        message: () => `E072: Roles cannot be created yet, please contact a developer to add a new role`,
        code: `E072`,
    },
    E073_NotImplementedYetForCreateAccountV2: {
        message: () => `E073: This functionality is not available for V2 create account`,
        code: `E073`,
    },
    E074_UnexpectedResponseFromProvider: { message: () => `E074: Unexpected response from our provider`, code: `E074` },
    E075_FailedToAddPaymentMethod: { message: () => `E075: Failed to add payment method`, code: `E075` },
    E076_GeneralNotImplemented: { message: () => `E076: Functionality Not Implemented Yet`, code: `E076` },
    E077_IssuerDoesntHaveVerificationsEndpoint: {
        message: (context: { issuerName: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E077: Infringement cannot be verified because infringement issuer {issuerName} does not have a verifications endpoint`;
            }
            return `E077: Infringement cannot be verified because infringement issuer ${context.issuerName} does not have a verifications endpoint`;
        },
        code: `E077`,
    },
    E078_IssuerNotSupportedForRedirections: { message: () => `E078: Issuer not supported for automated redirections yet`, code: `E078` },
    E079_InvalidRedirectionData: { message: () => `E079: Invalid redirection, check customer city and street`, code: `E079` },
    E080_RedirectionFailed: {
        message: (context: { generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E080: Failed to make the redirection request: {responseMessage}`;
            }
            return `E080: Failed to make the redirection request`;
        },
        code: `E080`,
    },
    E081_CouldNotRegenerateMetabaseURLs: { message: () => `E081: Could not regenerate all URLs`, code: `E081` },
    E082_NominationCannotBeMadeMissingDocuments: {
        message: () => `E082: The nomination can not be made because the required documents are not present`,
        code: `E082`,
    },
    E083_CouldNotRetrieveDocuments: { message: () => `E083: Something went wrong retrieving the documents`, code: `E083` },
    E084_InfringementNotReadyForRedirection: { message: () => `E084: This infringement is not ready for redirection`, code: `E084` },
    E085_IncorrectNominationStatusForRedirection: {
        message: (context: { nominationStatus: NominationStatus; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E085: This nomination has the following status; which means we cannot redirect it: {nominationStatus}`;
            }
            return `E085: This nomination has the following status; which means we cannot redirect it: ${context.nominationStatus}`;
        },
        code: `E085`,
    },
    E086_RequireLeaseContractForRedirection: {
        message: () =>
            `E086: Redirection can only occur on infringements linked to Lease Contracts, we need these details for the redirection`,
        code: `E086`,
    },
    E087_RequireNominatedAccountForRedirection: {
        message: () => `E087: There is no currently nominated account on this redirection, please contact support`,
        code: `E087`,
    },
    E088_OnlyRedirectionFromOwnerToUserImplemented: {
        message: () => `E088: Only redirection from owner to user is supported currently`,
        code: `E088`,
    },
    E089_FailedToSendFax: { message: () => `E089: Failed to send the fax, please contact support`, code: `E089` },
    E090_NoContactDetailsForIssuer: {
        message: (context: { issuerName: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E090: We do not have fax or email contact details for {issuerName}`;
            }
            return `E090: We do not have fax or email contact details for ${context.issuerName}`;
        },
        code: `E090`,
    },
    E091_NotInRedirectionProcessCannotBeApprovedOrDenied: {
        message: () => `E091: The infringement is not currently in the redirection process and cannot be manually approved or denied`,
        code: `E091`,
    },
    E092_FailedToCreatePartialInfringement: { message: () => `E092: Failed to create the partial infringement`, code: `E092` },
    E093_LoggedInNoToken: { message: () => `E093: Logged in but no token received`, code: `E093` },
    E094_ErrorFromOldFleets: {
        message: (context: { response: any; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E094: Error received from old road protect {response}`;
            }
            return `E094: Error received from old road protect ${context.response}`;
        },
        code: `E094`,
    },
    E095_ErrorRequestingFromOldFleets: {
        message: () => `E095: Something went wrong when making a request to the old fleets system`,
        code: `E095`,
    },
    E096_CouldNotFindClient: { message: () => `E096: Could not find the Client`, code: `E096` },
    E097_TaavuraNoValidIntent: { message: () => `E097: Request has no valid intent, please see validation information`, code: `E097` },
    E098_TaavuraCannotHandleOverlapCriteria: {
        message: () => `E098: Cannot adjust previous contract end date as the overlap criteria cannot be handled`,
        code: `E098`,
    },
    E099_TaavuraIdenticalIdsForUserAndOwner: {
        message: () => `E099: Identical IDs for veh_end_cust_id and veh_owner_id detected, but ID is not Taavura ID`,
        code: `E099`,
    },
    E100_UnsupportedProvider: { message: () => `E100: Unsupported provider`, code: `E100` },
    E101_AccountDetailsMissing: { message: () => `E101: Account details missing`, code: `E101` },
    E102_InfringementCannotBePaid: { message: () => `E102: This infringement cannot be paid`, code: `E102` },
    E103_PaymentToMunicipalityFailed: {
        message: (context: { message: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E103: Payment to Municipality failed: {message}`;
            }
            return `E103: Payment to Municipality failed: ${context.message}`;
        },
        code: `E103`,
    },
    E104_FailedToVerifyBeforePayment: { message: () => `E104: Failed to verify the infringement before payment`, code: `E104` },
    E105_PaymentFailedToOurAccount: {
        message: (context: { statusText: string; extendedStatusText: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E105: Payment failed on transfer to our account: {statusText}, {extendedStatusText}`;
            }
            return `E105: Payment failed on transfer to our account: ${context.statusText}, ${context.extendedStatusText}`;
        },
        code: `E105`,
    },
    E106_PaymentFailedToMunicipality: {
        message: (context: { message: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E106: Payment failed on forwarding to the municipality, you will receive an email from our team shortly: {message}`;
            }
            return `E106: Payment failed on forwarding to the municipality, you will receive an email from our team shortly: ${context.message}`;
        },
        code: `E106`,
    },
    E107_UnsupportedPaymentIntegration: { message: () => `E107: Unsupported payment integration at this time`, code: `E107` },
    E108_WrongNominationStatusForPayment: {
        message: (context: { status: NominationStatus; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E108: Nomination cannot be paid because it has the status: {status}`;
            }
            return `E108: Nomination cannot be paid because it has the status: ${context.status}`;
        },
        code: `E108`,
    },
    E109_InvalidRawInfringementData: { message: () => `E109: Invalid raw infringement data`, code: `E109` },
    E110_InvalidIssuerCode: { message: () => `E110: Invalid issuer code`, code: `E110` },
    E111_NoMapperForClient: { message: () => `E111: No mapper for this client`, code: `E111` },
    E112_NoDataToExport: { message: () => `E112: No data to export to spreadsheet`, code: `E112` },
    E113_TargetAccountMissingAddressInformation: {
        message: () => `E113: Target account is missing address information, no postal or physical address available for redirection`,
        code: `E113`,
    },
    E114_InvalidAddressForRedirectionMissingStreetCode: {
        message: (context: { streetName: string; city: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E114: Failed to find valid address information for the redirection, it is a physical address but we don't have a Street Code. Street Name: {streetName}, City: {city}`;
            }
            return `E114: Failed to find valid address information for the redirection, it is a physical address but we don't have a Street Code. Street Name: ${context.streetName}, City: ${context.city}`;
        },
        code: `E114`,
    },
    E115_InvalidAddressForRedirectionMissingStreetCode: {
        message: (context: { city: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E115:  No city code found for redirection address with city: {city}`;
            }
            return `E115:  No city code found for redirection address with city: ${context.city}`;
        },
        code: `E115`,
    },
    E116_RedirectionAccountInvalidAddress: {
        message: () => `E116: The redirection account is invalid and the address cannot be extracted`,
        code: `E116`,
    },
    E117_NoValidLocationsProvided: { message: () => `E117: No valid locations were provided, neither Postal nor Physical`, code: `E117` },
    E118_OwnerMustBeDefinedCreatingContract: { message: () => `E118: Owner must be defined when creating contract`, code: `E118` },
    E119_RequiredMetroparkCodeForIssuer: {
        message: (context: { issuerId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E119: Required external Metropark code for verification but none found for issuer id {issuerId}`;
            }
            return `E119: Required external Metropark code for verification but none found for issuer id ${context.issuerId}`;
        },
        code: `E119`,
    },
    E120_MultipleIssuersInSpreadsheet: {
        message: (context: { expected: string; actual: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E120: Found multiple issuers in the spreadsheet, please only upload one issuer at a time to avoid business errors. We expected {expected} but had {actual} in the spreadsheet.`;
            }
            return `E120: Found multiple issuers in the spreadsheet, please only upload one issuer at a time to avoid business errors. We expected ${context.expected} but had ${context.actual} in the spreadsheet.`;
        },
        code: `E120`,
    },
    E121_IssuerDoesNotExistForManualRedirection: {
        message: (context: { issuer: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E121: The issuer "{issuer}" was not found during the manual redirection.`;
            }
            return `E121: The issuer "${context.issuer}" was not found during the manual redirection.`;
        },
        code: `E121`,
    },
    E122_CrateDocumentDtoMissingFilename: {
        message: (context: { dto: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E122: The CreateDocumentDto does not have a fileName: {dto}`;
            }
            return `E122: The CreateDocumentDto does not have a fileName: ${context.dto}`;
        },
        code: `E122`,
    },
    E123_InvalidToken: { message: () => `E123: Invalid token`, code: `E123` },
    E124_RateLimitExceeded: { message: () => `E124: Rate limit exceeded`, code: `E124` },
    E125_FailedToQueryAddressFromGoogle: {
        message: (context: { location: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E125: Failed to query google for the address {location}`;
            }
            return `E125: Failed to query google for the address ${context.location}`;
        },
        code: `E125`,
    },
    E126_CouldNotFindContract: {
        message: (context: { contractId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E126: Could not find the Contract with id: {contractId}`;
            }
            return `E126: Could not find the Contract with id: ${context.contractId}`;
        },
        code: `E126`,
    },
    E127_NominationHasBeenRedirected: {
        message: (context: { nominationId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E127: The nomination with id {nominationId} failed to update because it has already been redirected`;
            }
            return `E127: The nomination with id ${context.nominationId} failed to update because it has already been redirected`;
        },
        code: `E127`,
    },
    E128_TryingToOverridePaymentDetailsException: { message: () => `E128: Trying to override payment details`, code: `E128` },
    E129_ATGUnhandledDocumentFilename: { message: () => `E129: ATG-Unhandled document filename`, code: `E129` },
    E130_MetabaseAuthenticationFailed: { message: () => `E130: Authentication with Metabase failed`, code: `E130` },
    E131_InfringementWithNoticeNumberExistsForIssuer: {
        message: () => `E131: Infringement with provided notice number already exists for the given issuer`,
        code: `E131`,
    },
    E132_IssuerNotFound: {
        message: (context: { issuerNameOrCode?: number | string; issuerId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E132: Could not find Issuer`;
            } else if (context.issuerNameOrCode) {
                return `E132: Issuer ${context.issuerNameOrCode} not found`;
            } else if (context.issuerId) {
                return `E132: Could not find Issuer with id: ${context.issuerId}`;
            } else {
                return `E132: Could not find Issuer`;
            }
        },
        code: `E132`,
    },
    E133_EnvVariableNotSet: {
        message: (context: { configName: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E133: Required env variable {configName} is not set`;
            }
            return `E133: Required env variable ${context.configName} is not set`;
        },
        code: `E133`,
    },
    E134_CouldNotFindPermissionToDelete: { message: () => `E134: Could not find the permission to delete`, code: `E134` },
    E135_CouldNotFindIssuerToDelete: { message: () => `E135: Could not find the Issuer to delete`, code: `E135` },
    E136_CouldNotFindLocationToDelete: { message: () => `E136: Could not find the Location to delete`, code: `E136` },
    E137_CouldNotFindLocation: {
        message: (context: { locationId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E137: Could not find the Location with id: {locationId}`;
            }
            return `E137: Could not find the Location with id: ${context.locationId}`;
        },
        code: `E137`,
    },
    E138_CouldNotFindNominationToDelete: { message: () => `E138: Could not find the Nomination to delete`, code: `E138` },
    E139_CouldNotFindPermission: {
        message: (context: { permissionId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E139: Could not find the permission with id: {permissionId}`;
            }
            return `E139: Could not find the permission with id: ${context.permissionId}`;
        },
        code: `E139`,
    },
    E140_DontHaveContactDetailsForUserRunningRequest: {
        message: () => `E140: We do not have fax or email contact details for the user running this request`,
        code: `E140`,
    },
    E141_AccountNotFoundForRedirection: {
        message: () => `E141: Account not found, the nomination cannot be created for an account that does not exist in the system`,
        code: `E141`,
    },
    E142_CouldNotFindPartialInfringementToDelete: {
        message: () => `E142: Could not find the Partial Infringement to delete`,
        code: `E142`,
    },
    E143_InfringementNotFoundOnATG: {
        message: (context: { noticeNumber: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E143: Infringement with notice number {noticeNumber} not found on ATG`;
            }
            return `E143: Infringement with notice number ${context.noticeNumber} not found on ATG`;
        },
        code: `E143`,
    },
    E144_CouldNotFindManualPaymentToDelete: { message: () => `E144: Could not find the Manual Payment to delete`, code: `E144` },
    E145_CouldNotFindManualPayment: {
        message: (context: { manualPaymentId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E145: Could not find the Manual Payment with id: {manualPaymentId}`;
            }
            return `E145: Could not find the Manual Payment with id: ${context.manualPaymentId}`;
        },
        code: `E145`,
    },
    E146_CouldNotFindPaymentToDelete: { message: () => `E146: Could not find the Payment to delete`, code: `E146` },
    E147_CouldNotFindPayment: {
        message: (context: { paymentId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E147: Could not find the Payment with id: {paymentId}`;
            }
            return `E147: Could not find the Payment with id: ${context.paymentId}`;
        },
        code: `E147`,
    },
    E148_CouldNotFindRoleToDelete: { message: () => `E148: Could not find the Role to delete`, code: `E148` },
    E149_NominationHAsAlreadyBeenPaid: { message: () => `E149: Nomination has already been manually paid on the system`, code: `E149` },
    E150_CouldNotFindRawInfringementToDelete: { message: () => `E150: Could not find the Raw Infringement to delete`, code: `E150` },
    E151_CouldNotFindRawInfringement: {
        message: (context: { rawInfringementId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E151: Could not find the Raw Infringement with id: {rawInfringementId}`;
            }
            return `E151: Could not find the Raw Infringement with id: ${context.rawInfringementId}`;
        },
        code: `E151`,
    },
    E152_CouldNotFindRequestInformationLog: {
        message: (context: { requestInformationLogId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E152: Could not find the Request Information Log with id: {requestInformationLogId}`;
            }
            return `E152: Could not find the Request Information Log with id: ${context.requestInformationLogId}`;
        },
        code: `E152`,
    },
    E153_FilterIsNotSupported: { message: () => `E153: This filter is not supported`, code: `E153` },
    E154_InvalidBetweenFilter: { message: () => `E154: Invalid between filter, exactly 2 values are required`, code: `E154` },
    E155_InvalidFilter: { message: () => `E155: Invalid filter`, code: `E155` },
    E156_CouldNotFindUserToDelete: { message: () => `E156: Could not find the User to delete`, code: `E156` },
    E157_CouldNotFindVehicleToDelete: { message: () => `E157: Could not find the Vehicle to delete`, code: `E157` },
    E158_QueueServiceIsNull: {
        message: (context: { serviceName: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E158: The queue service is null in the queueable job called {serviceName}. Please make sure to inject it into the job and send it to the base class through the constructor -> super(queueService).`;
            }
            return `E158: The queue service is null in the queueable job called ${context.serviceName}. Please make sure to inject it into the job and send it to the base class through the constructor -> super(queueService).`;
        },
        code: `E158`,
    },
    E159_QueueMissingProcessorType: {
        message: (context: { processorType: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E159: Could not find the processor for the type {processorType}, was it imported into a module in the system?`;
            }
            return `E159: Could not find the processor for the type ${context.processorType}, was it imported into a module in the system?`;
        },
        code: `E159`,
    },
    E160_UnrecognisedIntegration: {
        message: (context: { name: string; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E160: Unrecognised integration {name}`;
            }
            return `E160: Unrecognised integration ${context.name}`;
        },
        code: `E160`,
    },
    E161_RequiredShoharCodeForIssuer: {
        message: (context: { issuerId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E161: Required external Shohar code for verification but none found for issuer id {issuerId}`;
            }
            return `E161: Required external Shohar code for verification but none found for issuer id ${context.issuerId}`;
        },
        code: `E161`,
    },
    E162_NoAccountOnInfringementForRedirection: {
        message: (context: { to: string; infringementId: number; nominationId: number; generatingDocumentation?: boolean }) => {
            if (!!context.generatingDocumentation) {
                return `E162: No {to} on this infringement ({infringementId}) for nomination {nominationId} when doing a digital nomination.`;
            }
            return `E162: No ${context.to} on this infringement (${context.infringementId}) for nomination ${context.nominationId} when doing a digital nomination.`;
        },
        code: `E162`,
    },
    E163_InfringementNoteAlreadyExists: {
        message: () => `E163: An Infringement Note with that value already exists.`,
        code: `E163`,
    },
    E164_FailedToMergePdf: {
        message: (context: { error: any }) => `E164: Faild to merge documents: ${context.error}`,
        code: `E164`,
    },
    E165_TargetDriverMissingAddressInformation: {
        message: () => `E165: Target driver is missing address information, no postal or physical address available for redirection`,
        code: `E165`,
    },
    E165_FailedToCreateDriver: { message: () => `E092: Failed to create the driver`, code: `E092` },
    E166_CouldNotFindDriver: {
        message: (context?: { driverIdentifier?: number | string }) => {
            if (context.driverIdentifier) {
                return `E166: Driver with identifier ${context.driverIdentifier} not found`;
            } else {
                return `E166: Driver not found`;
            }
        },
        code: `E166`,
    },
    E167_DriverMustBeDefinedCreatingContract: { message: () => `E167: Driver must be defined when creating contract`, code: `E167` },
    E168_FetchingPartialInfringementsFailed: { message: () => `E168: Fetching partial infringements request failed`, code: `E168` },
    E169_InvalidDates: { message: () => `E169: Invalid date entry`, code: `E169` },
    E170_FailedToUpdateDriver: { message: () => `E170: Failed to update the driver`, code: `E170` },
    E270_PartialInfringementOCRServiceFailed: { message: () => `E270: Partial infringement service failed`, code: `E270` },
    E271_BadAccountRelationsSpreadsheetFormat: { message: () => `E271: Bad account relations spreadsheet format`, code: `E271` },
};

export const treeStructuredErrorCodes = {
    system: [ERROR_CODES.E001_AsyncStoreNotDefined, ERROR_CODES.E133_EnvVariableNotSet],
    deleteEntity: [
        ERROR_CODES.E006_CouldNotFindAccountRelationToDelete,
        ERROR_CODES.E002_CouldNotFindAccountRelationDocumentToDelete,
        ERROR_CODES.E003_CouldNotFindGeneratedDocumentToDelete,
        ERROR_CODES.E004_CouldNotFindInfringementNoteToDelete,
        ERROR_CODES.E005_CouldNotFindDocumentTemplateToDelete,
        ERROR_CODES.E028_CouldNotFindAccountUserToDelete,
        ERROR_CODES.E034_CouldNotFindAccountToDelete,
        ERROR_CODES.E035_CouldNotFindContractToDelete,
        ERROR_CODES.E039_CouldNotFindLeaseContractToDelete,
        ERROR_CODES.E047_CouldNotFindDocumentToDelete,
        ERROR_CODES.E053_CouldNotFindInfringementToDelete,
        ERROR_CODES.E134_CouldNotFindPermissionToDelete,
        ERROR_CODES.E135_CouldNotFindIssuerToDelete,
        ERROR_CODES.E136_CouldNotFindLocationToDelete,
        ERROR_CODES.E138_CouldNotFindNominationToDelete,
        ERROR_CODES.E141_AccountNotFoundForRedirection,
        ERROR_CODES.E144_CouldNotFindManualPaymentToDelete,
        ERROR_CODES.E146_CouldNotFindPaymentToDelete,
        ERROR_CODES.E148_CouldNotFindRoleToDelete,
        ERROR_CODES.E150_CouldNotFindRawInfringementToDelete,
        ERROR_CODES.E156_CouldNotFindUserToDelete,
    ],
    linking: [ERROR_CODES.E008_CouldNotFindDocumentToLink, ERROR_CODES.E008_CouldNotFindDocumentToLink],
    integrations: [
        ERROR_CODES.E009_ScheduledCrawlerNowFound,
        ERROR_CODES.E017_RequiredMileonCodeForIssuer,
        ERROR_CODES.E018_UnexpectedEmptyResponseFromCrawler,
        ERROR_CODES.E022_ErrorFromCrawler,
        ERROR_CODES.E048_CrawlerSyncRequiresInfringementIssuedForTheVehicle,
        ERROR_CODES.E077_IssuerDoesntHaveVerificationsEndpoint,
        ERROR_CODES.E119_RequiredMetroparkCodeForIssuer,
        ERROR_CODES.E160_UnrecognisedIntegration,
        ERROR_CODES.E161_RequiredShoharCodeForIssuer,
        ERROR_CODES.E168_FetchingPartialInfringementsFailed,
    ],
    payment: [
        ERROR_CODES.E074_UnexpectedResponseFromProvider,
        ERROR_CODES.E075_FailedToAddPaymentMethod,
        ERROR_CODES.E100_UnsupportedProvider,
        ERROR_CODES.E101_AccountDetailsMissing,
        ERROR_CODES.E102_InfringementCannotBePaid,
        ERROR_CODES.E103_PaymentToMunicipalityFailed,
        ERROR_CODES.E104_FailedToVerifyBeforePayment,
        ERROR_CODES.E105_PaymentFailedToOurAccount,
        ERROR_CODES.E106_PaymentFailedToMunicipality,
        ERROR_CODES.E107_UnsupportedPaymentIntegration,
        ERROR_CODES.E108_WrongNominationStatusForPayment,
        ERROR_CODES.E128_TryingToOverridePaymentDetailsException,
        ERROR_CODES.E149_NominationHAsAlreadyBeenPaid,
    ],
    findEntity: [
        ERROR_CODES.E011_CouldNotFindInfringementNote,
        ERROR_CODES.E012_CouldNotFindAccountRelation,
        ERROR_CODES.E014_CouldNotFindAccountRelationDocument,
        ERROR_CODES.E015_CouldNotFindDocumentTemplate,
        ERROR_CODES.E016_CouldNotFindGeneratedDocument,
        ERROR_CODES.E020_CouldNotFindNomination,
        ERROR_CODES.E026_CouldNotFindAccount,
        ERROR_CODES.E027_NoRolesFound,
        ERROR_CODES.E029_AccountUserNotFound,
        ERROR_CODES.E031_CouldNotFindRole,
        ERROR_CODES.E037_CouldNotFindInfringement,
        ERROR_CODES.E044_CouldNotFindDocument,
        ERROR_CODES.E049_CouldNotFindVehicle,
        ERROR_CODES.E050_NoContractToUpdate,
        ERROR_CODES.E052_NoContractFoundRelatingToAccount,
        ERROR_CODES.E060_UserNotFound,
        ERROR_CODES.E096_CouldNotFindClient,
        ERROR_CODES.E126_CouldNotFindContract,
        ERROR_CODES.E132_IssuerNotFound,
        ERROR_CODES.E137_CouldNotFindLocation,
        ERROR_CODES.E139_CouldNotFindPermission,
        ERROR_CODES.E143_InfringementNotFoundOnATG,
        ERROR_CODES.E145_CouldNotFindManualPayment,
        ERROR_CODES.E147_CouldNotFindPayment,
        ERROR_CODES.E151_CouldNotFindRawInfringement,
        ERROR_CODES.E152_CouldNotFindRequestInformationLog,
    ],
    fileHandling: [
        ERROR_CODES.E013_CouldNotMergeFile,
        ERROR_CODES.E045_FailedToLoadDocument,
        ERROR_CODES.E080_RedirectionFailed,
        ERROR_CODES.E083_CouldNotRetrieveDocuments,
        ERROR_CODES.E129_ATGUnhandledDocumentFilename,
    ],
    redirection: [
        ERROR_CODES.E021_VehicleNotRelatedToAccount,
        ERROR_CODES.E079_InvalidRedirectionData,
        ERROR_CODES.E082_NominationCannotBeMadeMissingDocuments,
        ERROR_CODES.E084_InfringementNotReadyForRedirection,
        ERROR_CODES.E085_IncorrectNominationStatusForRedirection,
        ERROR_CODES.E086_RequireLeaseContractForRedirection,
        ERROR_CODES.E087_RequireNominatedAccountForRedirection,
        ERROR_CODES.E088_OnlyRedirectionFromOwnerToUserImplemented,
        ERROR_CODES.E091_NotInRedirectionProcessCannotBeApprovedOrDenied,
        ERROR_CODES.E089_FailedToSendFax,
        ERROR_CODES.E090_NoContactDetailsForIssuer,
        ERROR_CODES.E113_TargetAccountMissingAddressInformation,
        ERROR_CODES.E114_InvalidAddressForRedirectionMissingStreetCode,
        ERROR_CODES.E115_InvalidAddressForRedirectionMissingStreetCode,
        ERROR_CODES.E116_RedirectionAccountInvalidAddress,
        ERROR_CODES.E121_IssuerDoesNotExistForManualRedirection,
        ERROR_CODES.E127_NominationHasBeenRedirected,
        ERROR_CODES.E140_DontHaveContactDetailsForUserRunningRequest,
        ERROR_CODES.E141_AccountNotFoundForRedirection,
        ERROR_CODES.E162_NoAccountOnInfringementForRedirection,
        ERROR_CODES.E165_TargetAccountMissingAddressInformation,
    ],
    relations: [
        ERROR_CODES.E024_CannotCreateRelationBetweenSameAccount,
        ERROR_CODES.E019_ForwardAccountNotFound,
        ERROR_CODES.E023_ReverseAccountNotFound,
    ],
    ocr: [ERROR_CODES.E025_ErrorFromContractOCR, ERROR_CODES.E036_DocumentDetailsDontMatchContract, ERROR_CODES.E041_NoFileUploadedToOCR],
    spreadsheet: [ERROR_CODES.E030_InvalidUploadedData, ERROR_CODES.E112_NoDataToExport, ERROR_CODES.E120_MultipleIssuersInSpreadsheet],
    createEntity: [
        ERROR_CODES.E038_ProvidedDatesOverlapWithExistingContract,
        ERROR_CODES.E043_FailedToAddDocument,
        ERROR_CODES.E046_FailedToCreateGeneratedDocument,
        ERROR_CODES.E092_FailedToCreatePartialInfringement,
        ERROR_CODES.E117_NoValidLocationsProvided,
        ERROR_CODES.E118_OwnerMustBeDefinedCreatingContract,
        ERROR_CODES.E131_InfringementWithNoticeNumberExistsForIssuer,
        ERROR_CODES.E122_CrateDocumentDtoMissingFilename,
        ERROR_CODES.E163_InfringementNoteAlreadyExists,
    ],
    notImplementedYet: [
        ERROR_CODES.E072_RoleCreationNotImplementedYet,
        ERROR_CODES.E033_MethodNotSupportedORProvidedIncorrectly,
        ERROR_CODES.E032_UpdateNotSupported,
        ERROR_CODES.E073_NotImplementedYetForCreateAccountV2,
        ERROR_CODES.E076_GeneralNotImplemented,
        ERROR_CODES.E078_IssuerNotSupportedForRedirections,
    ],
    autocomplete: [ERROR_CODES.E040_NotAutocompletableField],
    updateEntity: [
        ERROR_CODES.E042_NoLeaseContractToUpdate,
        ERROR_CODES.E051_NonUniqueContractReference,
        ERROR_CODES.E064_DisabledUpdateAccountBRN,
        ERROR_CODES.E065_InsufficientAddressInformationNoExistingPostal,
        ERROR_CODES.E066_InsufficientAddressInformationNoExistingPhysical,
    ],
    auth: [
        ERROR_CODES.E054_IncorrectLoginCredentials,
        ERROR_CODES.E010_InvalidAPIUserLogin,
        ERROR_CODES.E055_CannotLogingAsAPIUser,
        ERROR_CODES.E056_MaxLoginAttempts,
        ERROR_CODES.E057_MissingIdentityReLogin,
        ERROR_CODES.E058_CouldNotChangeAccountNotFound,
        ERROR_CODES.E059_CouldNotReturnUpdatedInformation,
        ERROR_CODES.E061_FailedToResetPasswordExpiredToken,
        ERROR_CODES.E062_CannotSendResetPasswordEmailNotInSystem,
        ERROR_CODES.E063_FailedToSendResetPasswordEmail,
        ERROR_CODES.E067_NotPermittedToTakeActionOnAccount,
        ERROR_CODES.E068_MissingLoginDetails,
        ERROR_CODES.E069_DontHavePermission,
        ERROR_CODES.E070_UseFrontendToPerformAction,
        ERROR_CODES.E071_MustBeSystemAdmin,
        ERROR_CODES.E093_LoggedInNoToken,
        ERROR_CODES.E123_InvalidToken,
        ERROR_CODES.E124_RateLimitExceeded,
    ],
    reporting: [
        ERROR_CODES.E081_CouldNotRegenerateMetabaseURLs,
        ERROR_CODES.E130_MetabaseAuthenticationFailed,
        ERROR_CODES.E169_InvalidDates,
    ],
    oldFleets: [ERROR_CODES.E094_ErrorFromOldFleets, ERROR_CODES.E095_ErrorRequestingFromOldFleets, ERROR_CODES.E110_InvalidIssuerCode],
    rawInfringement: [ERROR_CODES.E109_InvalidRawInfringementData, ERROR_CODES.E111_NoMapperForClient],
    taavura: [
        ERROR_CODES.E097_TaavuraNoValidIntent,
        ERROR_CODES.E098_TaavuraCannotHandleOverlapCriteria,
        ERROR_CODES.E099_TaavuraIdenticalIdsForUserAndOwner,
    ],
    googleLocation: [ERROR_CODES.E125_FailedToQueryAddressFromGoogle], // Not currently Implemented
    filters: [ERROR_CODES.E154_InvalidBetweenFilter, ERROR_CODES.E155_InvalidFilter, ERROR_CODES.E153_FilterIsNotSupported],
    queues: [ERROR_CODES.E158_QueueServiceIsNull, ERROR_CODES.E159_QueueMissingProcessorType],
};
