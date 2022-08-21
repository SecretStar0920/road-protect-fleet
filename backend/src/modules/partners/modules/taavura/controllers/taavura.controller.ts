import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Logger } from '@logger';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { RequestCacheInterceptor } from '@modules/shared/interceptors/request-cache.interceptor';
import { FeatureFlagGuard, FeatureFlagMetadata } from '@modules/shared/modules/feature-flag/guards/feature-flag.guard';
import { TaavuraVehicleContractDto } from '@modules/partners/modules/taavura/controllers/taavura-vehicle-contract.dto';
import { TaavuraVehicleContractService } from '@modules/partners/modules/taavura/services/taavura-vehicle-contract.service';

@Controller('taavura')
@UseGuards(UserAuthGuard)
@ApiTags('Taavura Custom')
export class TaavuraController {
    constructor(private logger: Logger, private taavuraService: TaavuraVehicleContractService) {}

    @Post('vehicle-contract')
    @ApiOperation({ summary: 'Create or update vehicle lease contract' })
    @UseInterceptors(RequestCacheInterceptor)
    @UseGuards(FeatureFlagGuard)
    @FeatureFlagMetadata({ title: 'taavura-vehicle-contract', defaultEnabled: true })
    async vehicleContractCreateOrUpdate(@Body() dto: TaavuraVehicleContractDto) {
        this.logger.log({
            message: 'Received vehicle-contract request from Taavura',
            detail: dto,
            fn: this.vehicleContractCreateOrUpdate.name,
        });

        return this.taavuraService.vehicleContractCreateOrUpdate(dto);
    }
}
