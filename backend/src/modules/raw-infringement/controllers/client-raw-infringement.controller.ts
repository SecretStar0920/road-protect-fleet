import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetRawInfringementService } from '@modules/raw-infringement/services/get-raw-infringement.service';
import { GetRawInfringementsService } from '@modules/raw-infringement/services/get-raw-infringements.service';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { Client, Infringement, RawInfringement } from '@entities';
import { ClientAuthGuard } from '@modules/auth/guards/client-auth.guard';
import { ClientDecorator } from '@modules/shared/decorators/client.decorator';
import { RequestCacheInterceptor } from '@modules/shared/interceptors/request-cache.interceptor';
import { FeatureFlagGuard, FeatureFlagMetadata } from '@modules/shared/modules/feature-flag/guards/feature-flag.guard';

export class UpdateRawInfringementDto {
    // Insert Properties
}

export class CreateRawInfringementDto {
    // Insert Properties
}

@Controller('client/infringement')
@UseGuards(ClientAuthGuard)
@UseInterceptors(RequestCacheInterceptor)
export class ClientRawInfringementController {
    constructor(
        private getRawInfringementService: GetRawInfringementService,
        private getRawInfringementsService: GetRawInfringementsService,
        private createRawInfringementService: CreateRawInfringementService,
    ) {}

    // @Get(':rawInfringementId')
    // async getRawInfringement(@Param('rawInfringementId') rawInfringementId: number): Promise<RawInfringement> {
    //     return await this.getRawInfringementService.get(rawInfringementId);
    // }
    //
    // @Get()
    // async getRawInfringements(): Promise<RawInfringement[]> {
    //     return await this.getRawInfringementsService.get();
    // }

    @Post()
    @UseGuards(FeatureFlagGuard)
    @FeatureFlagMetadata({ title: 'raw-infringements', defaultEnabled: true })
    async createRawInfringement(
        @Body() body: any,
        @ClientDecorator() client: Client,
    ): Promise<{ raw: RawInfringement; infringement?: Infringement }> {
        return await this.createRawInfringementService.createRawInfringement(body, client);
    }

    // @Post(':rawInfringementId')
    // async updateRawInfringement(@Param('rawInfringementId') rawInfringementId: number, @Body() dto: UpdateRawInfringementDto): Promise<RawInfringement> {
    //     return await this.updateRawInfringementService.update(rawInfringementId, dto);
    // }
    //
    // @Delete(':rawInfringementId')
    // async deleteRawInfringement(@Param('rawInfringementId') rawInfringementId): Promise<RawInfringement> {
    //     return await this.deleteRawInfringementService.delete(rawInfringementId);
    // }
    //
    // @Delete(':rawInfringementId/soft')
    // async softDeleteRawInfringement(@Param('rawInfringementId') rawInfringementId): Promise<RawInfringement> {
    //     return await this.deleteRawInfringementService.softDelete(rawInfringementId);
    // }
}
