export enum NominationStatus {
    Pending = 'Pending',
    Acknowledged = 'Acknowledged',
    InRedirectionProcess = 'In Redirection Process',
    RedirectionRequestError = 'Redirection Request Error',
    Closed = 'Closed', // CLARIFY AS NOT APPLICABLE
    RedirectionCompleted = 'Redirection Completed',
    RedirectionError = 'Redirection Error',
    RedirectedToThirdParty = 'Redirected To Third Party',
}
