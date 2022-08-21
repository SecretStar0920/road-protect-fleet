import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Nomination } from '@entities';

@Injectable()
export class GetNominationsService {
    constructor(private logger: Logger) {}

    async getNominations(): Promise<Nomination[]> {
        this.logger.log({ message: `Getting Nominations`, detail: null, fn: this.getNominations.name });
        const nominations = await Nomination.findWithMinimalRelations().getMany();
        this.logger.log({ message: `Found Nominations, length: `, detail: nominations.length, fn: this.getNominations.name });
        return nominations;
    }

    async getNominationsForAccount(accountId: number): Promise<Nomination[]> {
        this.logger.log({ message: `Getting Nominations for Account`, detail: accountId, fn: this.getNominations.name });
        const nominations = await Nomination.findWithMinimalRelations()
            .andWhere('nomination_account.accountId = :accountId', { accountId })
            .getMany();
        this.logger.log({ message: `Found Nominations, length: `, detail: nominations.length, fn: this.getNominations.name });
        return nominations;
    }

    async getNominationsForInfringement(infringementId: number): Promise<Nomination[]> {
        this.logger.log({ message: `Getting Nominations for Infringement`, detail: infringementId, fn: this.getNominations.name });
        const nominations = await Nomination.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .getMany();
        this.logger.log({ message: `Found Nominations, length: `, detail: nominations.length, fn: this.getNominations.name });
        return nominations;
    }
}
