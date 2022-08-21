import { IsDefined, IsOptional } from 'class-validator';
import { PartialInfringementDetailsDto } from '@modules/partial-infringement/dtos/partial-infringement-details.dto';

export class CreatePartialInfringementDto {
    @IsDefined()
    details: PartialInfringementDetailsDto;
    @IsOptional()
    noticeNumber?: string;
}
