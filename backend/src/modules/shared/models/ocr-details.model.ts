import { ApiProperty } from '@nestjs/swagger';

export class OcrDetails {
    @ApiProperty()
    contract?: string;
    @ApiProperty()
    customer?: string;
    @ApiProperty()
    owner?: string;
    @ApiProperty()
    car?: string;
    @ApiProperty()
    start?: string;
    @ApiProperty()
    end?: string;
}
