import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetVehicleService } from '@modules/vehicle/services/get-vehicle.service';
import { GetVehiclesService } from '@modules/vehicle/services/get-vehicles.service';
import { CreateVehicleService } from '@modules/vehicle/services/create-vehicle.service';
import { UpdateVehicleService } from '@modules/vehicle/services/update-vehicle.service';
import { DeleteVehicleService } from '@modules/vehicle/services/delete-vehicle.service';
import { Vehicle } from '@entities';
import { GetVehiclesForAccountService } from '@modules/vehicle/services/get-vehicles-for-account.service';
import { UpdateVehicleDto } from '@modules/vehicle/controllers/update-vehicle.dto';
import { CreateVehicleDto } from '@modules/vehicle/controllers/create-vehicle.dto';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { AtgVehicleSyncService } from '@modules/vehicle/services/atg-vehicle-sync.service';
import { IsNumber } from 'class-validator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { RateLimit, SetRateLimit } from '@modules/rate-limit/rate-limit.decorator';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { Config } from '@config/config';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class InitialSyncDto {
    @IsNumber({}, { each: true })
    vehicleIds: number[];
}

@Controller('vehicle')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Vehicles')
export class VehicleController {
    constructor(
        private getVehicleService: GetVehicleService,
        private getVehiclesService: GetVehiclesService,
        private getVehiclesForAccountService: GetVehiclesForAccountService,
        private createVehicleService: CreateVehicleService,
        private updateVehicleService: UpdateVehicleService,
        private deleteVehicleService: DeleteVehicleService,
        private vehicleScheduleService: AtgVehicleSyncService,
    ) {}

    @Get(':vehicleId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewVehicle)
    @ApiOperation({ summary: 'Get vehicle' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E049_CouldNotFindVehicle.message({ vehicleId: 'vehicleId' }) })
    async getVehicle(@Param('vehicleId') vehicleId: number): Promise<Vehicle> {
        return this.getVehicleService.getVehicle(vehicleId);
    }

    @Get()
    @UseGuards(PermissionGuard, SystemAdminGuard)
    @Permissions(PERMISSIONS.ViewVehicles)
    @ApiExcludeEndpoint()
    async getVehicles(): Promise<Vehicle[]> {
        return this.getVehiclesService.getVehicles();
    }

    @Get('account/:accountId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewVehicles)
    @ApiOperation({ summary: 'Get vehicles for account' })
    @ApiExcludeEndpoint()
    async getVehiclesForAccount(@Param('accountId') accountId: number): Promise<Vehicle[]> {
        return this.getVehiclesForAccountService.getVehiclesForAccount(accountId);
    }

    @Post()
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.CreateVehicle)
    @ApiOperation({ summary: 'Create vehicle' })
    @ApiResponse({ status: 400, description: 'Vehicle not found' })
    @ApiResponse({ status: 500, description: 'Failed to create vehicle, please contact the developers.' })
    @SetRateLimit(RateLimitActions.createVehicle, Config.get.rateLimit.actions.createVehicle)
    @RateLimit()
    async createVehicle(@Body() dto: CreateVehicleDto): Promise<Vehicle> {
        return this.createVehicleService.createVehicle(dto);
    }

    @Post('sync-with-atg')
    @ApiExcludeEndpoint()
    @UseGuards(SystemAdminGuard)
    async manualSyncVehicles() {
        return this.vehicleScheduleService.syncVehiclesWithAutomation();
    }

    @Post('initial-sync-with-atg')
    @ApiExcludeEndpoint()
    @UseGuards(SystemAdminGuard)
    async initialSyncVehicles(@Body() dto: InitialSyncDto) {
        return this.vehicleScheduleService.initialSyncVehiclesWithAutomation(dto);
    }

    @Post(':vehicleId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
    @ApiOperation({ summary: 'Edit vehicle' })
    @ApiResponse({ status: 400, description: 'Vehicle not found' })
    @ApiResponse({ status: 500, description: `Failed to update the vehicle - please contact the developers` })
    async updateVehicle(@Param('vehicleId') vehicleId: number, @Body() dto: UpdateVehicleDto): Promise<Vehicle> {
        return this.updateVehicleService.updateVehicle(vehicleId, dto);
    }

    @Delete(':vehicleId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.DeleteVehicles)
    @ApiOperation({ summary: 'Delete vehicle' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E157_CouldNotFindVehicleToDelete.message() })
    async deleteVehicle(@Param('vehicleId') vehicleId: number): Promise<Vehicle> {
        return this.deleteVehicleService.deleteVehicle(vehicleId);
    }

    @Delete(':vehicleId/soft')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.DeleteVehicles)
    @ApiOperation({ summary: 'Soft Delete vehicle' })
    @ApiExcludeEndpoint()
    async softDeleteVehicle(@Param('vehicleId') vehicleId: number): Promise<Vehicle> {
        return this.deleteVehicleService.softDeleteVehicle(vehicleId);
    }
}
