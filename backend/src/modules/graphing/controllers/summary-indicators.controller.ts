import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { SummaryIndicatorsService } from '@modules/graphing/services/summary-indicators.service';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { GetSummaryIndicatorsDto } from '@modules/graphing/controllers/get-summary-indicators.dto';

@Controller('summary-indicators')
@UseGuards(UserAuthGuard)
export class SummaryIndicatorsController {
    constructor(private summaryIndicatorsService: SummaryIndicatorsService) {}

    @Post()
    async getSummaryIndicatorsData(@Identity() identity: IdentityDto, @Body() dto: GetSummaryIndicatorsDto) {
        return await this.summaryIndicatorsService.getSummaryIndicators(identity.accountId, dto);
    }

    @Post('this-year')
    async getThisYearSummaryIndicators(@Identity() identity: IdentityDto, @Body() dto: GetSummaryIndicatorsDto) {
        dto.isDateComparison = false;
        return await this.summaryIndicatorsService.getThisYearSummaryIndicators(identity.accountId, dto);
    }

    @Post('year-comparison')
    async getComparisonSummaryIndicators(@Identity() identity: IdentityDto, @Body() dto: GetSummaryIndicatorsDto) {
        dto.isDateComparison = false;
        return await this.summaryIndicatorsService.getComparisonSummaryIndicators(identity.accountId, dto);
    }
}
