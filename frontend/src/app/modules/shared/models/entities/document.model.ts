import { Timestamped } from '@modules/shared/models/timestamped';

export class Document extends Timestamped {
    documentId: number;
    fileName: string;
    ocr?: RawContractOcr;
}

export class RawContractOcr {
    contract: string;
    customer: string;
    owner: string;
    car: string;
    start: string;
    end: string;
}
