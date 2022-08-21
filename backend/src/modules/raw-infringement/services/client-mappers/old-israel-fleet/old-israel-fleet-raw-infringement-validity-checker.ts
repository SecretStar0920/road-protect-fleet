import { Logger } from '@logger';
import { OldIsraelFleetRawInfringementDto } from '@modules/raw-infringement/services/client-mappers/old-israel-fleet/old-israel-fleet-raw-infringement.mapper';
import { RawInfringement } from '@entities';
import * as moment from 'moment';

export class OldIsraelFleetRawInfringementValidityChecker {
    constructor(private logger: Logger) {}

    async isValid(oldIsraelFleetFine: OldIsraelFleetRawInfringementDto): Promise<boolean> {
        this.logger.debug({
            message: `Checking for validity of fine with id ${oldIsraelFleetFine.fine_id}`,
            detail: {
                fineId: oldIsraelFleetFine.fine_id,
            },
            fn: this.isValid.name,
        });

        const rawFines = await RawInfringement.createQueryBuilder('rawInfringements')
            .where(`"rawInfringements"."data"->>'fine_id' = :fineId`, {
                fineId: oldIsraelFleetFine.fine_id,
            })
            .andWhere(`"rawInfringements"."result"->'result'->>'perform' != 'false'`)
            .getMany();

        this.logger.debug({
            message: `Found ${rawFines.length} raw infringements with id ${oldIsraelFleetFine.fine_id}.`,
            detail: {
                fineId: oldIsraelFleetFine.fine_id,
                numFines: rawFines.length,
            },
            fn: this.isValid.name,
        });

        const incomingDate = moment(oldIsraelFleetFine.fine_status_date);

        const isValid = rawFines
            .map((fine) => (fine.data || {}).fine_status_date)
            .filter((date) => date)
            .map((date) => moment(date))
            .map((date) => incomingDate.isSameOrAfter(date))
            // Check that the incoming date is after all of them
            .reduce((a, b) => a && b, true);

        this.logger.debug({
            message: `The infringements with id ${oldIsraelFleetFine.fine_id} returned ${isValid ? 'TRUE' : 'FALSE'} for this update.`,
            detail: {
                fineId: oldIsraelFleetFine.fine_id,
            },
            fn: this.isValid.name,
        });

        return isValid;
    }
}
