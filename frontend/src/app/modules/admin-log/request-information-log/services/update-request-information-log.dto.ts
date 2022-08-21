
import { IsOptional } from 'class-validator';

export class UpdateRequestInformationLogDto {

    @IsOptional()
    responseReceived?: boolean;

    @IsOptional()
    responseReceivedDate?: string;
}
