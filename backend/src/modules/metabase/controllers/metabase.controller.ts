import { Controller, Get, InternalServerErrorException, Param, Post, UseGuards } from '@nestjs/common';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { MetabaseEmbedService } from '@modules/metabase/services/metabase-embed.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { MetabaseCollectionService } from '@modules/metabase/services/metabase-collection.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Controller('metabase')
@UseGuards(UserAuthGuard, SystemAdminGuard)
export class MetabaseController {
    constructor(private metabaseEmbedService: MetabaseEmbedService, private metabaseCollectionService: MetabaseCollectionService) {}

    @Post('regenerate-embed-urls')
    @ApiExcludeEndpoint()
    async regenerateEmbedUrls(): Promise<boolean> {
        try {
            await this.metabaseEmbedService.regenerateUrls();
            return true;
        } catch (e) {
            throw new InternalServerErrorException({ message: ERROR_CODES.E081_CouldNotRegenerateMetabaseURLs.message(), error: e });
        }
    }

    @Get('collection/:id')
    async getCollectionById(@Param('id') id: number): Promise<any> {
        return this.metabaseCollectionService.getMetabaseCollectionById(id);
    }

    @Get('collection')
    async getAllCollections(): Promise<any[]> {
        return this.metabaseCollectionService.getMetabaseCollections();
    }
}
