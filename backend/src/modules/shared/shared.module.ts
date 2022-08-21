import { DocumentModule } from '@modules/document/document.module';
import { NominationModule } from '@modules/nomination/nomination.module';
import { DatabaseModule } from '@modules/shared/modules/database/database.module';
import { EmailModule } from '@modules/shared/modules/email/email.module';
import { FaxModule } from '@modules/shared/modules/fax/fax.module';
import { FeatureFlagModule } from '@modules/shared/modules/feature-flag/feature-flag.module';
import { RealtimeModule } from '@modules/shared/modules/realtime/realtime.module';
import { SpreadsheetModule } from '@modules/shared/modules/spreadsheet/spreadsheet.module';
import { LinkingService } from '@modules/shared/services/linking.service';
import { Logger } from '@modules/shared/services/logger.service';
import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { RateLimitModule } from '@modules/rate-limit/rate-limit.module';
import { AntivirusModule } from '@modules/shared/modules/antivirus/antivirus.module';
import { CronModule } from '@modules/shared/modules/cron/cron.module';
import { RedisModule } from '@modules/shared/modules/redis/redis.module';
import { SocketStateModule } from '@modules/shared/modules/socket-state/socket-state.module';
import { ErrorCodesModule } from './modules/error-codes/error-codes.module';
import { AppRoutesProviderService } from '@modules/shared/services/app-routes-provider.service';

@Global()
@Module({
    imports: [
        DatabaseModule,
        EmailModule,
        FaxModule,
        MulterModule.register({
            limits: {
                fieldNameSize: 1024,
                fieldSize: 25 * 1000 * 1000,
            },
        }),
        SpreadsheetModule,
        DocumentModule,
        RealtimeModule,
        NominationModule,
        FeatureFlagModule,
        RateLimitModule,
        AntivirusModule,
        CronModule,
        RedisModule,
        SocketStateModule,
        ErrorCodesModule,
        AppRoutesProviderService
    ],
    providers: [
        {
            provide: Logger,
            useValue: Logger.instance,
        },
        LinkingService,
    ],
    exports: [
        DatabaseModule,
        EmailModule,
        FaxModule,
        {
            provide: Logger,
            useValue: Logger.instance,
        },
        SpreadsheetModule,
        DocumentModule,
        LinkingService,
        RealtimeModule,
        FeatureFlagModule,
        RateLimitModule,
        AntivirusModule,
        CronModule,
        AppRoutesProviderService
    ],
})
export class SharedModule {}
