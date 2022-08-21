import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { MetabaseEmbedService } from '@modules/metabase/services/metabase-embed.service';
import { MetabaseCollectionService } from '@modules/metabase/services/metabase-collection.service';
import { Config } from '@config/config';

@Controller('metabase-account-questions')
@UseGuards(UserAuthGuard)
export class MetabaseAccountQuestionsController {
    constructor(private metabaseEmbedService: MetabaseEmbedService, private metabaseCollectionService: MetabaseCollectionService) {}
    //
    // @Get('url/:id')
    // getAccountMetabaseQuestionsUrl(@Identity() identity: IdentityDto, @Param('id') id: number) {
    //     return this.metabaseEmbedService.getAccountQuestionUrl(identity.accountId, id);
    // }

    @Get('details')
    getCustomMetabaseItemDetails(@Identity() identity: IdentityDto) {
        return this.metabaseCollectionService.getAllMetabaseCollectionItemsByAccountId(identity.accountId);
    }

    @Get('details/default')
    getDefaultMetabaseItemDetails(@Identity() identity: IdentityDto) {
        return this.metabaseCollectionService.getMetabaseCollectionItemsByCollectionId(
            Config.get.metabase.collections.default,
            identity.accountId,
        );
    }

    @Get('details/kpi')
    async getAccountMetabaseKPIDashboardDetails(@Param('id') id: number, @Identity() identity: IdentityDto) {
        const kpiDetails = await this.metabaseCollectionService.getMetabaseCollectionItemsByCollectionId(
            Config.get.metabase.collections.kpi,
            identity.accountId,
        );
        return { data: kpiDetails };
    }

    @Get('details/:id')
    getAccountMetabaseItemDetails(@Param('id') id: number, @Identity() identity: IdentityDto) {
        return this.metabaseCollectionService.getMetabaseCollectionItemsByCollectionId(id, identity.accountId);
    }
}
