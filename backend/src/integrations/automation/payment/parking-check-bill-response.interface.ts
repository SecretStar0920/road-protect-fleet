export interface ParkingCheckBill {
    'soap:Envelope': SoapEnvelope;
}

export interface SoapEnvelope {
    'soap:Body': SoapBody;
    $: SoapEnvelopeClass;
}

export interface SoapEnvelopeClass {
    'xmlns:soap': string;
    'xmlns:xsi': string;
    'xmlns:xsd': string;
}

export interface SoapBody {
    ParkingCheckBillResponse: ParkingCheckBillResponseClass;
}

export interface ParkingCheckBillResponseClass {
    ParkingCheckBillResult: ParkingCheckBillResult;
    $: ParkingCheckBillResponse;
}

export interface ParkingCheckBillResponse {
    xmlns: string;
}

export interface ParkingCheckBillResult {
    OperationId: string;
    Description: string;
    Sum: string;
    ActionCode: string;
    IskaNumber: string;
    TransactionId: string;
    FunctionName: string;
}
