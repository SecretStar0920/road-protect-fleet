import { TestableIntegrationDto } from '@modules/integration-test/models/testable-integration.model';
import { AtgRawInfringementDto } from '@modules/raw-infringement/services/client-mappers/atg/atg-raw-infringement.dto';
import { Trim, TrimLeadingZeros } from '@modules/shared/helpers/trim.transform';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ATGTicketSystemHeader {
    @IsString()
    // tslint:disable-next-line:variable-name
    Customer: string;
    @IsNumber()
    // tslint:disable-next-line:variable-name
    Recipient: number;
    @IsNumber()
    // tslint:disable-next-line:variable-name
    Sender: number;
    @IsString()
    // tslint:disable-next-line:variable-name
    Token: string;
    @IsString()
    // tslint:disable-next-line:variable-name
    TranID: string;
    @IsString()
    // tslint:disable-next-line:variable-name
    UserId: string;
    @IsString()
    // tslint:disable-next-line:variable-name
    UserPass: string;
    @IsString()
    // tslint:disable-next-line:variable-name
    Version: string;
}

export class ATGTicketRequest extends TestableIntegrationDto {
    @IsString()
    customer: string;
    @IsString()
    ticketNumber: string;
    @IsString()
    carNumber: string;
}

export class ATGTicketDetails {
    @ValidateNested()
    @Type(() => ATGTicketSystemHeader)
    systemHeader: ATGTicketSystemHeader;
    @ValidateNested()
    @Type(() => ATGTicketRequest)
    // tslint:disable-next-line:variable-name
    appData: ATGTicketRequest;
}

class ATGTicketResponseMessage {
    @IsString()
    // tslint:disable-next-line:variable-name
    RcMessage: string;
    @IsNumber()
    // tslint:disable-next-line:variable-name
    RcNumber: number;
    @IsNumber()
    // tslint:disable-next-line:variable-name
    RcOwner: number;
    @IsNumber()
    // tslint:disable-next-line:variable-name
    RcType: number;
    @IsString()
    // tslint:disable-next-line:variable-name
    RcVersion: string;
    @IsString()
    // tslint:disable-next-line:variable-name
    RcFieldName: string;
}
class ATGTicketResponseGlobals {
    @IsString()
    // tslint:disable-next-line:variable-name
    FileNetToken: string;
    @IsString()
    // tslint:disable-next-line:variable-name
    IisIp: string;
}

export class AtgVerifyIntegrationRawInfringementDto extends AtgRawInfringementDto {
    @IsString()
    @IsOptional()
    @Trim()
    dateOfFirstNotice: string;

    @IsString()
    @IsOptional()
    @Trim()
    @TrimLeadingZeros()
    driverIdNumber: string;

    @IsString()
    @IsOptional()
    @Trim()
    driverFirstName: string;

    @IsString()
    @IsOptional()
    @Trim()
    driverLastName: string;

    @IsString()
    @IsOptional()
    @Trim()
    driverStreetAddress: string;

    @IsString()
    @IsOptional()
    @Trim()
    driverHouseNumber: string;

    @IsString()
    @IsOptional()
    @Trim()
    driverApartment: string;

    @IsString()
    @IsOptional()
    @Trim()
    driverCity: string;

    @IsString()
    @IsOptional()
    @Trim()
    driverPostalCode: string;

    @IsString()
    @IsOptional()
    @Trim()
    refNumer: string;
}
class ATGTicketResponseData {
    ticketDetails: AtgVerifyIntegrationRawInfringementDto;
}

export class ATGTicketResponse {
    // tslint:disable-next-line:variable-name
    Msg: ATGTicketResponseMessage;
    // tslint:disable-next-line:variable-name
    Globals: ATGTicketResponseGlobals;

    appDataResponse: ATGTicketResponseData;
}
