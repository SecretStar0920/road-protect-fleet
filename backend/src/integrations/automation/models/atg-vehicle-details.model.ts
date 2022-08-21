import { TestableIntegrationDto } from '@modules/integration-test/models/testable-integration.model';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString, ValidateNested } from 'class-validator';
import * as moment from 'moment';

export class ATGVehicleRequest extends TestableIntegrationDto {
    @IsString()
    vehicleId: string;
    @IsDateString()
    @Transform((val) => moment(val).toISOString())
    startTime: string;
    @IsDateString()
    @Transform((val) => moment(val).toISOString())
    endTime: string;
}

export class ATGVehicleFleetRequest {
    @IsString()
    companyId: string;
    @IsString()
    vehicleId: string;
    @IsString()
    startTime: string;
    @IsString()
    endTime: string;
    @IsString()
    reference: string;
}

export class ATGVehicleSyncSystemHeader {
    @IsNumber()
    customerField: number;
    @IsNumber()
    recipientField: number;
    @IsNumber()
    senderField: number;
    @IsString()
    tokenField: string;
    @IsString()
    tranIDField: string;
    @IsString()
    userIdField: string;
    @IsString()
    userPassField: string;
    @IsString()
    versionField: string;
}

export class ATGVehicleDetails {
    @ValidateNested()
    @Type(() => ATGVehicleSyncSystemHeader)
    // tslint:disable-next-line:variable-name
    SystemHeader: ATGVehicleSyncSystemHeader;
    @ValidateNested()
    @Type(() => ATGVehicleFleetRequest)
    // tslint:disable-next-line:variable-name
    VehicleFleetRequest: ATGVehicleFleetRequest;
}
