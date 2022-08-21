import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractReferenceDto {
    @IsString()
    @IsDefined()
    @ApiProperty({
        description: 'The new reference for this contract',
        example: 'My internal reference 15192',
    })
    reference: string;
}
