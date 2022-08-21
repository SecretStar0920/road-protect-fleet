import { Module } from '@nestjs/common';
import { HomeReportingQueryService } from '@modules/reporting/home-reporting/services/home-reporting-query.service';
import { HomeReportingService } from '@modules/reporting/home-reporting/services/home-reporting.service';
import { HomeReportingController } from '@modules/reporting/home-reporting/controllers/home-reporting.controller';

@Module({
    providers: [HomeReportingService, HomeReportingQueryService],
    controllers: [HomeReportingController],
    exports: [HomeReportingQueryService],
})
export class HomeReportingModule {}
