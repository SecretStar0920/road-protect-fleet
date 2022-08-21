import { RawLocationParserHelper } from '@entities';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { RawInfringementQueryController } from '@modules/raw-infringement/controllers/raw-infringement-query.controller';
import { RawInfringementUtilityController } from '@modules/raw-infringement/controllers/raw-infringement-utility.controller';
import { RawInfringementMapperService } from '@modules/raw-infringement/services/raw-infringement-mapper.service';
import { forwardRef, Module } from '@nestjs/common';
import { ClientRawInfringementController } from './controllers/client-raw-infringement.controller';
import { RawInfringementController } from './controllers/raw-infringement.controller';
import { CreateRawInfringementService } from './services/create-raw-infringement.service';
import { DeleteRawInfringementService } from './services/delete-raw-infringement.service';
import { GetRawInfringementService } from './services/get-raw-infringement.service';
import { GetRawInfringementsService } from './services/get-raw-infringements.service';
import { RawInfringementIdentifierService } from './services/raw-infringement-identifier.service';
import { UpdateRawInfringementService } from './services/update-raw-infringement.service';
import { InfringementNoteModule } from '@modules/infringement-note/infringement-note.module';

@Module({
    controllers: [
        RawInfringementUtilityController,
        ClientRawInfringementController,
        RawInfringementQueryController,
        RawInfringementController,
    ],
    providers: [
        CreateRawInfringementService,
        UpdateRawInfringementService,
        GetRawInfringementService,
        GetRawInfringementsService,
        DeleteRawInfringementService,
        RawInfringementMapperService,
        AtgIssuers,
        RawLocationParserHelper,
        RawInfringementIdentifierService,
    ],
    exports: [CreateRawInfringementService],
    imports: [forwardRef(() => InfringementModule), InfringementNoteModule],
})
export class RawInfringementModule {}
