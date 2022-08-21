import { Injectable } from '@nestjs/common';
import { Contract } from '@entities';
import * as moment from 'moment';
import { fixDate } from '@modules/shared/helpers/fix-date';
import { Config } from '@config/config';
import { Promax } from 'promax';

@Injectable()
export class FixContractService {
    async fixDates() {
        const contracts = await Contract.createQueryBuilder('contract').getMany();

        const results = [];
        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        });
        for (const contract of contracts) {
            let startDateMoment = moment(contract.startDate);
            if (startDateMoment.hours() > 12) {
                startDateMoment = startDateMoment.add(1, 'day');
            }
            let endDateMoment = moment(contract.endDate);
            if (endDateMoment.hours() > 12) {
                endDateMoment = endDateMoment.add(1, 'day');
            }
            const startDate = fixDate(startDateMoment.format('YYYY-MM-DD'), Config.get.app.timezone);
            const endDate = fixDate(endDateMoment.format('YYYY-MM-DD'), Config.get.app.timezone);
            results.push({
                contract,
                startDate,
                endDate,
            });
            promax.add(async () => {
                contract.startDate = startDate;
                contract.endDate = endDate;
                await contract.save();
                return contract;
            });
        }

        await promax.run();

        return results;
    }
}
