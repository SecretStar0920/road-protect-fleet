import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DigitalNominationHistoricalProcessingService } from '@modules/nomination/services/digital-nomination-historical-processing.service';
import { Logger } from '@logger';

@Injectable()
export class DigitalNominationCronService {
    constructor(
        private digitalNominationHistoricalProcessingService: DigitalNominationHistoricalProcessingService,
        private logger: Logger,
    ) {}

    @Cron('*/15 * * * *')
    async fixIncorrectlyNominatedInfringements() {
        this.logger.debug({
            message: `Running the check for infringements that have not been digitally nominated correctly`,
            fn: this.fixIncorrectlyNominatedInfringements.name,
        });
        await this.digitalNominationHistoricalProcessingService.processAllHistoricalInfringements();
    }
}
