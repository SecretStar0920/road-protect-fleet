import { IsDateString, IsDefined, IsOptional } from 'class-validator';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class CreateLeaseContractDto {
    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'create-contract.vehicle' })
    vehicle: number | string;
    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'create-contract.user' })
    user: number | string;
    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'create-contract.owner' })
    owner: number | string;
    @IsDateString()
    @SpreadsheetMetadata({ required: true, label: 'create-contract.start_date' })
    startDate: string;
    @IsDateString()
    @SpreadsheetMetadata({ required: false, label: 'create-contract.end_date' })
    endDate: string;
    @IsOptional()
    document?: number;
    @IsOptional()
    @SpreadsheetMetadata({ required: false, label: 'create-contract.reference' })
    reference?: string;
}
