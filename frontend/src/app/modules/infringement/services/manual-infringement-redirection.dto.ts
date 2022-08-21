import { IsBoolean, IsDefined, IsString } from 'class-validator';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class ManualInfringementRedirectionDto {
    @IsDefined()
    @SpreadsheetMetadata({
        label: 'redirect-nomination.user',
    })
    user?: string;

    @IsString()
    @SpreadsheetMetadata({
        label: 'infringement.notice_number',
    })
    noticeNumber: string;

    @IsString()
    @SpreadsheetMetadata({
        label: 'infringement.issuer',
    })
    issuer: string;

    @IsBoolean()
    @SpreadsheetMetadata({
        label: 'redirect-nomination.redirection_complete',
    })
    complete: boolean;
}
