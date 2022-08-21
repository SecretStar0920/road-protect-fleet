import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UploadOcrPartialInfringementsDto {
    @IsDefined()
    @ApiProperty({ description: 'Code of an issuer of partial infringements' })
    issuerName: string;

    @IsDefined()
    @ApiProperty({ description: 'Expected number of documents in file' })
    documentsNumber: number;

    @IsDefined()
    @ApiProperty({ description: 'Defines if this is completed list of infringements from issuer' })
    isCompleteList: boolean;
}
