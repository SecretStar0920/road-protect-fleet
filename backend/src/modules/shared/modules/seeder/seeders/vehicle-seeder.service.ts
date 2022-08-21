import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Issuer } from '@entities';
import { CreateVehicleService } from '@modules/vehicle/services/create-vehicle.service';
import { CreateVehicleDto } from '@modules/vehicle/controllers/create-vehicle.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class VehicleSeederService extends BaseSeederService<CreateVehicleDto> {
    protected seederName: string = 'Issuer';

    constructor(private createVehicleService: CreateVehicleService) {
        super();
    }

    async setSeedData() {
        this.seedData = [];

        if (this.isDevelopment) {
            this.seedData = [
                ...this.seedData,
                ...[
                    {
                        registration: 'TESTVEHICLEONE',
                        manufacturer: 'BMW',
                    },
                ],
            ];
        }
    }

    async seedItemFunction(item: CreateVehicleDto) {
        item = plainToClass(CreateVehicleDto, item);
        return this.createVehicleService.createVehicle(item);
    }
}
