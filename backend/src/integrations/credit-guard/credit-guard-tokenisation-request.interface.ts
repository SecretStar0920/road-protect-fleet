export interface CreditGuardRequest {
    ashrait: Ashrait;
}

export interface Ashrait {
    request: Request;
}

export interface Request {
    version: string;
    language: string;
    dateTime?: string;
    command: string;
    doDeal: DoDeal;
    mayBeDuplicate?: string;
}

export interface DoDeal {
    successUrl?: string;
    errorUrl?: string;
    cancelUrl?: string;
    terminalNumber: string;
    mainTerminalNumber?: string;
    cardNo?: string;
    total: string;
    transactionType: string;
    creditType: string;
    currency: string;
    transactionCode: string;
    authNumber?: string;
    numberOfPayments?: string;
    firstPayment?: string;
    periodicalPayment?: string;
    validation: string;
    dealerNumber?: string;
    user?: string;
    mid?: string;
    uniqueid?: string;
    mpiValidation?: string;
    email?: string;
    clientIP?: string;
    customerData?: CustomerData;

    cardId?: string;
    cardExpiration?: string;
    cvv?: string;
}

export interface CustomerData {
    userData1?: string;
    userData2?: string;
    userData3?: string;
    userData4?: string;
    userData5?: string;
    userData6?: string;
    userData7?: string;
    userData8?: string;
    userData9?: string;
    userData10?: string;
}
