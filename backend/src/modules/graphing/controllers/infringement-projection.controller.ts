import { Controller, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { InfringementProjectionDataDto, InfringementProjectionService } from '@modules/graphing/services/infringement-projection.service';
import { GetInfringementProjectionDto } from '@modules/graphing/controllers/get-infringement-projection.dto';

@Controller('infringement-projection-table')
@UseGuards(UserAuthGuard)
export class InfringementProjectionController {
    constructor(private infringementProjectionService: InfringementProjectionService) {}

    @Post()
    getInfringementProjectionData(
        @Identity() identity: IdentityDto,
        @Body() dto: GetInfringementProjectionDto,
    ): Promise<InfringementProjectionDataDto> {
        return this.infringementProjectionService.getInfringementProjectionData(identity.accountId, dto);
    }
}
