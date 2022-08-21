import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Infringement, InfringementNote } from '@entities';
import { CreateInfringementNoteService } from '@modules/infringement-note/services/create-infringement-note.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { CreateInfringementNoteDto } from '@modules/infringement-note/dto/create-infringement-note.dto';
import { UpsertInfringementNoteDto } from '@modules/infringement-note/dto/upsert-infringement-note.dto';

@Injectable()
export class UpsertInfringementNoteService {
    constructor(private logger: Logger, private createInfringementNoteService: CreateInfringementNoteService) {}

    async upsertMultipleInfringementNotes(notes: string[], accountId?: number, infringement?: Infringement): Promise<InfringementNote[]> {
        this.logger.log({ message: `Upserting ${notes.length} Infringement Notes`, detail: notes, fn: this.upsertInfringementNote.name });
        const createdInfringementNotes: InfringementNote[] = [];
        for (const note of notes) {
            try {
                const createdNote = await this.upsertInfringementNote({ value: note }, accountId, infringement);
                if (createdNote) {
                    createdInfringementNotes.push(createdNote);
                }
            } catch (error) {
                this.logger.warn({
                    message: 'Failed to create infringement note',
                    detail: error,
                    fn: this.upsertMultipleInfringementNotes.name,
                });
            }
        }
        return createdInfringementNotes;
    }

    async upsertInfringementNote(dto: UpsertInfringementNoteDto, accountId?: number, infringement?: Infringement) {
        this.logger.log({ message: 'Upserting Infringement Note', fn: this.upsertInfringementNote.name });
        let infringementId: number;
        // Find infringement
        if (!infringement && (dto.infringementId || dto.infringement.infringementId)) {
            infringementId = dto.infringementId ? dto.infringementId : dto.infringement.infringementId;
            infringement = await Infringement.findById(infringementId);
        }

        if (!infringement) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ context: infringementId }) });
        }
        dto.infringement = infringement;

        // Find existing infringement notes
        const infringementNotes = await InfringementNote.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :infringementId', { infringementId: infringement.infringementId })
            .andWhere('"infringementNote"."adminNote" = :adminNote', { adminNote: dto.adminNote ?? false })
            .getMany();
        // Check if there are any existing notes, if there are none, create a note
        if (!infringementNotes || infringementNotes.length < 1) {
            const createDto: CreateInfringementNoteDto = {
                infringementId: infringement.infringementId,
                value: dto.value,
                adminNote: dto.adminNote
            };

            return await this.createInfringementNoteService.createInfringementNote(
                createDto,
                accountId ? accountId : dto.createdBy?.accountId,
            );
        }
        // Check the existing notes to prevent a duplicate note being created
        if (infringementNotes.filter((note) => note.value === dto.value).length < 1) {
            // Infringement note does not exist
            const createDto: CreateInfringementNoteDto = {
                infringementId: infringement.infringementId,
                value: dto.value,
                adminNote: dto.adminNote
            };

            return await this.createInfringementNoteService.createInfringementNote(
                createDto,
                accountId ? accountId : dto.createdBy?.accountId,
            );
        }
        // Infringement note already exists
        this.logger.debug({
            message: `An Infringement Note with that value already exists on infringement ${infringement.infringementId} `,
            detail: {
                existingNotes: infringementNotes.filter((note) => note.value === dto.value),
                newNote: dto,
            },
            fn: this.upsertInfringementNote.name,
        });
        // throw new BadRequestException({ message: ERROR_CODES.E163_InfringementNoteAlreadyExists.message() });
        return null;
    }
}
