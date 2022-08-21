import { Injectable } from '@nestjs/common';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { InfringementNote } from '@entities';
import { UpdateInfringementNoteDto } from '@modules/infringement-note/dto/update-infringement-note.dto';

@Injectable()
export class UpdateInfringementNoteService {
    constructor(private logger: Logger) {}

    async updateInfringementNote(id: number, dto: UpdateInfringementNoteDto): Promise<InfringementNote> {
        this.logger.log({ message: 'Updating Infringement Note: ', detail: merge({ id }, dto), fn: this.updateInfringementNote.name });
        let infringementNote = await InfringementNote.findOne(id);
        infringementNote = merge(infringementNote, dto);
        await infringementNote.save();
        this.logger.log({ message: 'Updated Infringement Note: ', detail: id, fn: this.updateInfringementNote.name });
        return infringementNote;
    }
}
