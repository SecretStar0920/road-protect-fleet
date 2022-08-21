import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { Account, Infringement, Nomination, User, Vehicle } from '@entities';

@Injectable()
export class AdminSummaryReportingService {
    constructor(private logger: Logger) {}

    async getSummaryData(): Promise<ReportingDataDto> {
        return {
            data: [
                { name: 'Vehicles', value: await Vehicle.count() },
                { name: 'Accounts', value: await Account.count() },
                { name: 'Users', value: await User.count() },
                { name: 'Infringements', value: await Infringement.count() },
                { name: 'Nominations', value: await Nomination.count() },
            ],
        };
    }
}
