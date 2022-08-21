import { Module } from '@nestjs/common';
import { VerifyInfringementService } from '@modules/infringement/services/verify-infringement.service';
import { CrawlersModule } from '@modules/crawlers/crawlers.module';
import { AtgModule } from '@modules/partners/modules/atg/atg.module';

@Module({
    controllers: [],
    providers: [VerifyInfringementService],
    imports: [CrawlersModule, AtgModule],
    exports: [VerifyInfringementService],
})
export class VerifyInfringementModule {}
