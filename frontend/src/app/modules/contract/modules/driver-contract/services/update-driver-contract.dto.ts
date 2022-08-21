import { IsDateString, IsDefined, IsOptional } from 'class-validator';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class UpdateDriverContractDto {
    // Insert update properties
    @IsDefined()
    @SpreadsheetMetadata({ label: 'create-contract.vehicle', required: true })
    vehicle: number | string;
    @IsDefined()
    @SpreadsheetMetadata({ label: 'create-contract.driver', required: true })
    driver: number | string;
    @IsDateString()
    @SpreadsheetMetadata({ label: 'create-contract.start_date', required: true })
    startDate: string;
    @IsDateString()
    @SpreadsheetMetadata({ label: 'create-contract.end_date', required: true })
    endDate: string;
    @IsOptional()
    @SpreadsheetMetadata({ label: 'create-contract.reference' })
    reference: string;

    @IsOptional()
    document?: number;
}
