import { Module } from '@nestjs/common';
import { LocationController } from './controllers/location.controller';
import { CreateLocationService } from './services/create-location.service';
import { UpdateLocationService } from './services/update-location.service';
import { GetLocationService } from './services/get-location.service';
import { GetLocationsService } from './services/get-locations.service';
import { DeleteLocationService } from './services/delete-location.service';
import { GoogleLocationService } from './services/google-location.service';
import { LocationScheduleService } from '@modules/location/services/location-schedule.service';

@Module({
    controllers: [LocationController],
    providers: [
        CreateLocationService,
        UpdateLocationService,
        GetLocationService,
        GetLocationsService,
        DeleteLocationService,
        GoogleLocationService,
        LocationScheduleService,
    ],
    imports: [],
    exports: [CreateLocationService, UpdateLocationService],
})
export class LocationModule {}
