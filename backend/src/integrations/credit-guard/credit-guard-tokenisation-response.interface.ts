export interface CreditGuardTokenisationResponse {
    ashrait?: Ashrait;
}

export interface Ashrait {
    response?: Response;
}

export interface Response {
    command?: string;
    dateTime?: string;
    requestId?: string;
    tranId?: string;
    result?: string;
    message?: string;
    userMessage?: string;
    additionalInfo?: string;
    version?: string;
    language?: string;
    doDeal?: DoDeal;
}

export interface DoDeal {
    status?: string;
    statusText?: string;
    extendedStatusText?: string;
    terminalNumber?: string;
    cardNo?: string;
    cardName?: string;
    cardExpiration?: string;
    cardType?: CardAcquirer;
    creditCompany?: CardAcquirer;
    cardBrand?: CardAcquirer;
    cardAcquirer?: CardAcquirer;
    serviceCode?: string;
    transactionType?: AuthSource;
    creditType?: AuthSource;
    currency?: AuthSource;
    transactionCode?: AuthSource;
    total?: string;
    balance?: string;
    starTotal?: string;
    firstPayment?: string;
    periodicalPayment?: string;
    numberOfPayments?: string;
    clubId?: string;
    clubCode?: string;
    validation?: AuthSource;
    commReason?: CardAcquirer;
    idStatus?: CardAcquirer;
    cvvStatus?: CardAcquirer;
    authSource?: AuthSource;
    authNumber?: string;
    fileNumber?: string;
    slaveTerminalNumber?: string;
    slaveTerminalSequence?: string;
    creditGroup?: string;
    pinKeyIn?: string;
    pfsc?: string;
    eci?: string;
    cavv?: CardAcquirer;
    user?: string;
    addonData?: string;
    supplierNumber?: string;
    intIn?: string;
    intOt?: string;
    mid?: string;
    uniqueid?: string;
    mpiValidation?: string;
    email?: string;
    token?: string;
    mpiHostedPageUrl?: string;
}

export interface AuthSource {
    _?: string;
    $?: Empty;
}

export interface Empty {
    code?: string;
}

export interface CardAcquirer {
    $?: Empty;
}
