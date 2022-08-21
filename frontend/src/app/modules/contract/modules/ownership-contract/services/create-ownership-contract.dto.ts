import { IsDateString, IsDefined, IsOptional } from 'class-validator';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class CreateOwnershipContractDto {
    @IsDefined()
    @SpreadsheetMetadata({ label: 'create-contract.vehicle', required: true })
    vehicle: number | string;
    @IsDefined()
    @SpreadsheetMetadata({ label: 'create-contract.owner', required: true })
    owner: number | string;
    @IsDateString()
    @SpreadsheetMetadata({ label: 'create-contract.start_date', required: true })
    startDate: string;
    @IsDateString()
    @SpreadsheetMetadata({ label: 'create-contract.end_date', required: true })
    endDate: string;

    @IsOptional()
    document?: number;
}
