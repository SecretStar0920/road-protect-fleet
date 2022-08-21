import { Module } from '@nestjs/common';
import { GraphingController } from './controllers/graphing.controller';
import { GraphingByStatusService } from './services/graphing-by-status.service';
import { GraphingByIssuerService } from '@modules/graphing/services/graphing-by-issuer.service';
import { SummaryIndicatorsService } from './services/summary-indicators.service';
import { SummaryIndicatorsController } from './controllers/summary-indicators.controller';
import { GraphingByVehicleService } from '@modules/graphing/services/graphing-by-vehicle.service';
import { InfringementProjectionController } from '@modules/graphing/controllers/infringement-projection.controller';
import { InfringementProjectionService } from '@modules/graphing/services/infringement-projection.service';
import { SummaryIndicatorsDataManipulationService } from '@modules/graphing/services/summary-indicators-data-manipulation.service';
import { InfringementProjectionQueryService } from '@modules/graphing/services/infringement-projection-query.service';
import { SummaryIndicatorsQueryService } from '@modules/graphing/services/summary-indicators-query.service';

@Module({
    controllers: [GraphingController, SummaryIndicatorsController, InfringementProjectionController],
    providers: [
        GraphingByStatusService,
        GraphingByIssuerService,
        GraphingByVehicleService,
        SummaryIndicatorsService,
        InfringementProjectionService,
        InfringementProjectionQueryService,
        SummaryIndicatorsDataManipulationService,
        SummaryIndicatorsQueryService,
    ],
    exports: [InfringementProjectionQueryService, SummaryIndicatorsQueryService],
})
export class GraphingModule {}
