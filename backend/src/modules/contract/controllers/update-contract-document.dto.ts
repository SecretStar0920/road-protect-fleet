import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractDocumentDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description:
            'The new documentId for the contract document (vehicle licence for ownership and lease contract for lease contract), ' +
            'please create the document first using the document API if you do not have this ID',
        example: 112,
    })
    documentId?: number;
}
