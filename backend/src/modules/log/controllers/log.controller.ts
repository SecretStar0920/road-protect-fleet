import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { LogService, LogParameters } from '@modules/log/services/log.service';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('log')
@UseGuards(UserAuthGuard)
export class LogController {
    constructor(private logService: LogService) {}

    @Put()
    @UseGuards(UserAuthGuard)
    @ApiExcludeEndpoint()
    async getAllLogs(@Body() logParameters: LogParameters) {
        return await this.logService.getAllLogsAndHistory(logParameters);
    }
}
