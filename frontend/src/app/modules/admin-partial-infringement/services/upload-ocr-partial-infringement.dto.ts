import { IsDefined } from 'class-validator';

export class UploadOcrPartialInfringementDto {
    @IsDefined()
    issuerName: string;

    @IsDefined()
    documentsNumber: number;

    @IsDefined()
    isCompleteList: boolean;
}
