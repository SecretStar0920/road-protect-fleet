import { IsDefined, IsOptional } from 'class-validator';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { RequestInformationLogDetails } from '@modules/shared/models/entities/request-information-log.model';

export class CreateRequestInformationLogDto {
    @IsDefined()
    requestSendDate?: string;

    @IsDefined()
    senderAccount: Account;

    @IsDefined()
    issuer: Issuer;

    @IsOptional()
    details: RequestInformationLogDetails;

    @IsOptional()
    responseReceived: boolean;

    @IsOptional()
    responseReceivedDate?: string;
}
