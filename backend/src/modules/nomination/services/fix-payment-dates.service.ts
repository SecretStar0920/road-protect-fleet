import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Infringement, InfringementStatus } from '@entities';
import { Promax } from 'promax';
import { Config } from '@config/config';
import * as moment from 'moment';

@Injectable()
export class FixPaymentDatesService {
    constructor(private logger: Logger) {}

    async fix(limit = 10000) {
        this.logger.log({
            fn: this.fix.name,
            message: `Running the fix payment dates function`,
        });
        const infringements = await Infringement.findWithMinimalRelations()
            .where('infringement.status = :paid', {
                paid: InfringementStatus.Paid,
            })
            .innerJoinAndSelect('infringement.infringementRevisionHistory', 'infringementRevisionHistory')
            .andWhere('nomination.paidDate IS NULL')
            .limit(limit)
            .getMany();

        this.logger.log({
            fn: this.fix.name,
            message: `Found ${infringements.length} infringements to look at`,
        });

        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        });
        promax.add(infringements.map((inf) => async () => this.fixInfringement(inf)));
        await promax.run();
        return promax.getResultMap();
    }

    private async fixInfringement(infringement: Infringement) {
        if (infringement.nomination.paidDate !== null) {
            return null;
        }
        this.logger.warn({
            fn: this.fixInfringement.name,
            message: `Found infringement ${infringement.infringementId} with a nomination that did not have the payment date recorded.`,
            detail: infringement,
        });
        const historyElements = infringement.infringementRevisionHistory;
        let latestDate: moment.Moment = null;
        for (const history of historyElements) {
            if (!history.old || !history.old['status']) {
                continue;
            }
            const currentDate = moment(history.timestamp);
            latestDate = latestDate === null ? currentDate : latestDate;

            if (currentDate.isBefore(latestDate)) {
                latestDate = currentDate;
            }
        }
        const nomination = infringement.nomination;
        nomination.paidDate = latestDate ? latestDate.toISOString() : moment(nomination.createdAt).toISOString();

        this.logger.warn({
            fn: this.fixInfringement.name,
            message: `Setting the payment date for infringement ${infringement.infringementId} to ${nomination.paidDate}.`,
            detail: infringement,
        });

        await nomination.save();
        return nomination;
    }
}
