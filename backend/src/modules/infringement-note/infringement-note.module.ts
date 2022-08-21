import { Module } from '@nestjs/common';
import { InfringementNoteController } from './controllers/infringement-note.controller';
import { CreateInfringementNoteService } from './services/create-infringement-note.service';
import { UpdateInfringementNoteService } from './services/update-infringement-note.service';
import { GetInfringementNoteService } from './services/get-infringement-note.service';
import { GetInfringementNotesService } from './services/get-infringement-notes.service';
import { DeleteInfringementNoteService } from './services/delete-infringement-note.service';
import { InfringementNoteQueryController } from '@modules/infringement-note/controllers/infringement-note-query.controller';
import { UpsertInfringementNoteService } from '@modules/infringement-note/services/upsert-infringement-note-service';

@Module({
    controllers: [InfringementNoteController, InfringementNoteQueryController],
    providers: [
        CreateInfringementNoteService,
        UpdateInfringementNoteService,
        GetInfringementNoteService,
        UpsertInfringementNoteService,
        GetInfringementNotesService,
        DeleteInfringementNoteService,
    ],
    imports: [],
    exports: [UpsertInfringementNoteService, GetInfringementNotesService],
})
export class InfringementNoteModule {}
