import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetLocationService } from '@modules/location/services/get-location.service';
import { GetLocationsService } from '@modules/location/services/get-locations.service';
import { CreateLocationService } from '@modules/location/services/create-location.service';
import { UpdateLocationService } from '@modules/location/services/update-location.service';
import { DeleteLocationService } from '@modules/location/services/delete-location.service';
import { Location, Street } from '@entities';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { CreateLocationDetailedDto } from '@modules/location/controllers/create-location-detailed.dto';
import { UpdateLocationDetailedDto } from '@modules/location/controllers/update-location-detailed-dto';

@Controller('location')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class LocationController {
    constructor(
        private getLocationService: GetLocationService,
        private getLocationsService: GetLocationsService,
        private createLocationService: CreateLocationService,
        private updateLocationService: UpdateLocationService,
        private deleteLocationService: DeleteLocationService,
    ) {}

    @Get(':locationId')
    async getLocation(@Param('locationId') locationId: number): Promise<Location> {
        return await this.getLocationService.getLocation(locationId);
    }

    @Get()
    @UseGuards(SystemAdminGuard)
    async getLocations(): Promise<Location[]> {
        return await this.getLocationsService.getLocations();
    }

    @Post()
    @UseGuards(SystemAdminGuard)
    async createLocation(@Body() dto: CreateLocationDetailedDto): Promise<Location> {
        return await this.createLocationService.savePhysicalLocation(dto);
    }

    @Post(':locationId')
    @UseGuards(SystemAdminGuard)
    async updateLocation(@Param('locationId') locationId: number, @Body() dto: UpdateLocationDetailedDto): Promise<Location> {
        return await this.updateLocationService.updateLocation(locationId, dto);
    }

    @Delete(':locationId')
    @UseGuards(SystemAdminGuard)
    async deleteLocation(@Param('locationId') locationId: number): Promise<Location> {
        return await this.deleteLocationService.deleteLocation(locationId);
    }

    @Delete(':locationId/soft')
    @UseGuards(SystemAdminGuard)
    async softDeleteLocation(@Param('locationId') locationId: number): Promise<Location> {
        return await this.deleteLocationService.softDeleteLocation(locationId);
    }

    @Post('street-code/sync')
    @UseGuards(SystemAdminGuard)
    async syncStreetCodes() {
        await Street.syncStreetCodesIsrael();
        return Street.find();
    }
}
