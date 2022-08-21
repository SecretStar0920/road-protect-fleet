import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetInfringementNoteService } from '@modules/infringement-note/services/get-infringement-note.service';
import { GetInfringementNotesService } from '@modules/infringement-note/services/get-infringement-notes.service';
import { UpdateInfringementNoteService } from '@modules/infringement-note/services/update-infringement-note.service';
import { DeleteInfringementNoteService } from '@modules/infringement-note/services/delete-infringement-note.service';
import { InfringementNote } from '@entities';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { UpsertInfringementNoteService } from '@modules/infringement-note/services/upsert-infringement-note-service';
import { CreateInfringementNoteDto } from '@modules/infringement-note/dto/create-infringement-note.dto';
import { UpdateInfringementNoteDto } from '@modules/infringement-note/dto/update-infringement-note.dto';

@Controller('infringement-note')
@UseGuards(UserAuthGuard)
export class InfringementNoteController {
    constructor(
        private getInfringementNoteService: GetInfringementNoteService,
        private getInfringementNotesService: GetInfringementNotesService,
        private updateInfringementNoteService: UpdateInfringementNoteService,
        private upsertInfringementNoteService: UpsertInfringementNoteService,
        private deleteInfringementNoteService: DeleteInfringementNoteService,
    ) {}

    @Get(':infringementNoteId')
    async getInfringementNote(@Param('infringementNoteId') infringementNoteId: number): Promise<InfringementNote> {
        return await this.getInfringementNoteService.getInfringementNote(infringementNoteId);
    }

    @Get()
    async getInfringementNotes(): Promise<InfringementNote[]> {
        return await this.getInfringementNotesService.getInfringementNotes();
    }

    @Get('infringement/:infringementId')
    async getInfringementNotesForInfringement(
        @Param('infringementId') infringementId: number,
        @Identity() identity: IdentityDto,
    ): Promise<InfringementNote[]> {
        return await this.getInfringementNotesService.getInfringementNotesForInfringement(infringementId, identity.accountId);
    }

    @Post()
    async createInfringementNote(@Body() dto: CreateInfringementNoteDto, @Identity() identity: IdentityDto): Promise<InfringementNote> {
        if (identity.user.type !== 'Admin' && identity.user.type !== 'Developer') {
            dto.adminNote = false
        }

        return await this.upsertInfringementNoteService.upsertInfringementNote(dto, identity.accountId);
    }

    @Post(':infringementNoteId')
    async updateInfringementNote(
        @Param('infringementNoteId') infringementNoteId: number,
        @Body() dto: UpdateInfringementNoteDto,
    ): Promise<InfringementNote> {
        return await this.updateInfringementNoteService.updateInfringementNote(infringementNoteId, dto);
    }

    @Delete(':infringementNoteId')
    async deleteInfringementNote(@Param('infringementNoteId') infringementNoteId: number): Promise<InfringementNote> {
        return await this.deleteInfringementNoteService.deleteInfringementNote(infringementNoteId);
    }

    @Delete(':infringementNoteId/soft')
    async softDeleteInfringementNote(@Param('infringementNoteId') infringementNoteId: number): Promise<InfringementNote> {
        return await this.deleteInfringementNoteService.softDeleteInfringementNote(infringementNoteId);
    }
}
