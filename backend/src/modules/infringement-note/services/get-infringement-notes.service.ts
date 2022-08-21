import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { InfringementNote } from '@entities';

@Injectable()
export class GetInfringementNotesService {
    constructor(private logger: Logger) {}

    async getInfringementNotes(): Promise<InfringementNote[]> {
        this.logger.log({ message: `Getting Infringement Notes`, detail: null, fn: this.getInfringementNotes.name });
        const infringementNotes = await InfringementNote.findWithMinimalRelations().getMany();
        this.logger.log({
            message: `Found Infringement Notes, length: `,
            detail: infringementNotes.length,
            fn: this.getInfringementNotes.name,
        });
        return infringementNotes;
    }

    async getInfringementNotesForInfringement(infringementId: number, accountId?: number) {
        this.logger.log({
            message: `Getting Infringement Notes for infringement`,
            detail: { infringementId },
            fn: this.getInfringementNotes.name,
        });
        const infringementNotes = await InfringementNote.findWithMinimalRelations()
            .where('infringement.infringementId = :infringementId', { infringementId })
            // .andWhere('account.accountId = :accountId', { accountId })
            .getMany();
        this.logger.log({
            message: `Found Infringement Notes, length: `,
            detail: infringementNotes.length,
            fn: this.getInfringementNotes.name,
        });
        return infringementNotes;
    }
}
