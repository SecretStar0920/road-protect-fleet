import { Controller, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { GraphingByStatusService, RawGraphingByStatusData } from '@modules/graphing/services/graphing-by-status.service';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { GraphingByIssuerService, RawGraphingByIssuerData } from '@modules/graphing/services/graphing-by-issuer.service';
import { GraphingByVehicleService, RawGraphingByVehicleData } from '@modules/graphing/services/graphing-by-vehicle.service';
import { GraphingDataDto } from '@modules/graphing/controllers/graphing-data.dto';

@Controller('graphing')
@UseGuards(UserAuthGuard)
export class GraphingController {
    constructor(
        private graphingByStatusService: GraphingByStatusService,
        private graphingByIssuerService: GraphingByIssuerService,
        private graphingByVehicleService: GraphingByVehicleService,
    ) {}

    @Post('by-status')
    getMonthToMonthDataByStatus(@Identity() identity: IdentityDto, @Body() dto: GraphingDataDto): Promise<RawGraphingByStatusData[]> {
        return this.graphingByStatusService.getAggregatedByStatusData(identity.accountId, dto);
    }

    @Post('by-issuer')
    getMonthToMonthDataByIssuer(@Identity() identity: IdentityDto, @Body() dto: GraphingDataDto): Promise<RawGraphingByIssuerData[]> {
        return this.graphingByIssuerService.getAggregatedByIssuerData(identity.accountId, dto);
    }

    @Post('by-vehicle')
    getAggregatedDataByVehicle(@Identity() identity: IdentityDto, @Body() dto: GraphingDataDto): Promise<RawGraphingByVehicleData[]> {
        return this.graphingByVehicleService.getAggregatedByVehicleData(identity.accountId, dto);
    }
}
