import { Controller, Post, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '@modules/auth/guards/permission.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { DateRangeDto } from '@modules/graphing/controllers/date-range.dto';
import { HomeReportingDataDto, HomeReportingService } from '@modules/reporting/home-reporting/services/home-reporting.service';

@Controller('home-reporting')
@UseGuards(UserAuthGuard, PermissionGuard)
export class HomeReportingController {
    constructor(private homeReportingService: HomeReportingService) {}

    @Post()
    async getAccountReportingData(@Identity() identity: IdentityDto, @Body() dates: DateRangeDto): Promise<HomeReportingDataDto> {
        return this.homeReportingService.getAllHomeReportingData(identity.accountId, dates);
    }
}
