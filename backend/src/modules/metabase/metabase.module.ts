import { Module } from '@nestjs/common';
import { MetabaseEmbedService } from './services/metabase-embed.service';
import { MetabaseController } from './controllers/metabase.controller';
import { MetabaseApiIntegrationService } from './services/metabase-api-integration.service';
import { MetabaseCollectionService } from './services/metabase-collection.service';
import { MetabaseAccountQuestionsController } from '@modules/metabase/controllers/metabase-account-questions.controller';

@Module({
    providers: [MetabaseEmbedService, MetabaseApiIntegrationService, MetabaseCollectionService],
    exports: [MetabaseEmbedService],
    controllers: [MetabaseController, MetabaseAccountQuestionsController],
})
export class MetabaseModule {}
