import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { DeleteDriverService } from '@modules/driver/services/delete-driver.service';
import { CreateDriverService } from '@modules/driver/services/create-driver.service';
import { CreateDriverDto } from '@modules/driver/dtos/create-driver.dto';
import { Driver } from '@entities';
import { GetDriverService } from '@modules/driver/services/get-driver.service';
import { UpdateDriverDto } from '@modules/driver/dtos/update-driver.dto';

@Controller('driver')
@UseGuards(UserAuthGuard)
export class DriverController {
    constructor(
        private createDriverService: CreateDriverService,
        private deleteDriverService: DeleteDriverService,
        private getDriverService: GetDriverService
    ) {}

    @Get(':driverId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getDriver(@Param('driverId') driverId): Promise<Driver> {
        return this.getDriverService.getDriver(driverId);
    }

    @Post()
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async createDriver(@Body() dto: CreateDriverDto): Promise<Driver> {
        return this.createDriverService.createDriver(dto);
    }

    @Post(':driverId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async updateDriver(@Param('driverId') driverId, @Body() updateDriverDto: UpdateDriverDto): Promise<Driver> {
        return this.createDriverService.updateDriver(driverId, updateDriverDto);
    }

    @Delete(':driverId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async deleteDriver(@Param('driverId') driverId: number): Promise<Driver> {
        return await this.deleteDriverService.deleteDriver(driverId);
    }
}
