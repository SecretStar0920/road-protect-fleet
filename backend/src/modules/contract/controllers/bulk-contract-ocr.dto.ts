import { IsDefined, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkContractOcrDto {
    @IsInt({ each: true })
    @IsDefined()
    @ApiProperty({ description: 'An array of contractIds to run OCR' })
    contractIds: number[];
}
