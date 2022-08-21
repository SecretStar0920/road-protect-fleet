import { Logger } from '@logger';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AvailableIntegrations, IntegrationTestService } from '@modules/integration-test/services/integration-test.service';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('integration/test')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class IntegrationTestController {
    constructor(private integrationTestService: IntegrationTestService, private logger: Logger) {}

    @Post(':integrationName')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async testIntegration(@Param('integrationName') name: AvailableIntegrations, @Body() dto: any): Promise<any> {
        this.logger.debug({ message: `Received request to test integration ${name}`, fn: this.testIntegration.name, detail: dto });
        try {
            const result = await this.integrationTestService.test(name, dto);
            this.logger.debug({ message: `Received response from integration ${name}`, fn: this.testIntegration.name, detail: result });
            return result;
        } catch (error) {
            this.logger.error({
                message: `Error thrown while testing integration ${name}`,
                fn: this.testIntegration.name,
                detail: error.message,
            });
            return { error: error.message };
        }
    }
}
