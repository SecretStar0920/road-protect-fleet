import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';

export class SyncVehicleLocationDto {
    @IsNumber()
    accountId: string;

    @IsString()
    @Transform((val) => {
        return vehicleRegistrationFormat(val);
    })
    registration: string;

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;
}
