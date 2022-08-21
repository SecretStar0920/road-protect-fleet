import { IsDateString, IsDefined, IsOptional } from 'class-validator';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class UpdateLeaseContractDto {
    @IsDateString()
    @SpreadsheetMetadata({ required: true, label: 'update-contract.start_date' })
    startDate: string;
    @IsDateString()
    @SpreadsheetMetadata({ required: true, label: 'update-contract.end_date' })
    endDate: string;
    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'update-contract.user' })
    user: number | string;
    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'update-contract.owner' })
    owner: number | string;
    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'update-contract.vehicle' })
    vehicle: number | string;
    @IsOptional()
    @SpreadsheetMetadata({ required: false, label: 'update-contract.reference' })
    reference?: string;
}
