import { ATGTicketRequest } from '@integrations/automation/models/atg-ticket-details.model';
import { ATGVehicleRequest } from '@integrations/automation/models/atg-vehicle-details.model';
import { AddVehicleAutomationIntegration } from '@integrations/automation/vehicle/add-vehicle.automation-integration';
import { UpdateVehicleAutomationIntegration } from '@integrations/automation/vehicle/update-vehicle.automation-integration';
import { VerifyInfringementAutomationIntegration } from '@integrations/automation/verify-infringement.automation-integration';
import { JerusalemCrawlerJobDto } from '@modules/crawlers/jobs/jerusalem-sync-multiple-infringements.job';
import { MileonCrawlerJobDto } from '@modules/crawlers/jobs/mileon-sync-multiple-infringements.job';
import { PoliceCrawlerJobDto } from '@modules/crawlers/jobs/police-sync-multiple-infringements.job';
import { TelavivCrawlerJobDto } from '@modules/crawlers/jobs/telaviv-sync-multiple-infringements.job';
import { TestableIntegration, TestableIntegrationDto } from '@modules/integration-test/models/testable-integration.model';
import { JerusalemCrawlerSyncIntegrationTest } from '@modules/integration-test/services/crawler-integration-tests/jerusalem-crawler-sync-integration-test.service';
import { MileonCrawlerSyncIntegrationTest } from '@modules/integration-test/services/crawler-integration-tests/mileon-crawler-sync-integration-test.service';
import { PoliceCrawlerSyncIntegrationTest } from '@modules/integration-test/services/crawler-integration-tests/police-crawler-sync-integration-test.service';
import { TelavivCrawlerSyncIntegrationTest } from '@modules/integration-test/services/crawler-integration-tests/telaviv-crawler-sync-integration-test.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate } from 'class-validator';
import { isEmpty } from 'lodash';
import {
    TelavivCrawlerSyncWithNoticeNumberIntegrationTest,
    TelavivTestCrawlerSyncWithNoticeNumberDto,
} from '@modules/integration-test/services/crawler-integration-tests/telaviv-crawler-sync-with-notice-number-integration-test.service';
import {
    PoliceCrawlerSyncWithCaseNumberIntegrationTest,
    PoliceCrawlerWithCaseNumberDto,
} from '@modules/integration-test/services/crawler-integration-tests/police-crawler-sync-with-case-number-integration-test.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export enum AvailableIntegrations {
    ATGVerifyInfringement = 'ATG_Verify_Infringement',
    AddATGVehicle = 'Add_ATG_Vehicle',
    UpdateATGVehicle = 'Update_ATG_Vehicle',
    JerusalemCrawlerSyncForVehicle = 'Jerusalem_Crawler_Sync',
    TelavivCrawlerSyncForCustomer = 'Telaviv_Crawler_Sync',
    TelavivCrawlerSyncForCustomerWithNoticeNumber = 'Telaviv_Crawler_Sync_With_Notice_Number',
    MileonCrawlerSyncForVehicle = 'Mileon_Crawler_Sync',
    PoliceCrawlerSyncForVehicle = 'Police_Crawler_Sync',
    PoliceCrawlerSyncForVehicleWithCaseNumber = 'Police_Crawler_Sync_With_Case_Number',
}

const integrationDtoFactory = {
    [AvailableIntegrations.ATGVerifyInfringement]: ATGTicketRequest,
    [AvailableIntegrations.AddATGVehicle]: ATGVehicleRequest,
    [AvailableIntegrations.UpdateATGVehicle]: ATGVehicleRequest,
    [AvailableIntegrations.JerusalemCrawlerSyncForVehicle]: JerusalemCrawlerJobDto,
    [AvailableIntegrations.TelavivCrawlerSyncForCustomer]: TelavivCrawlerJobDto,
    [AvailableIntegrations.TelavivCrawlerSyncForCustomerWithNoticeNumber]: TelavivTestCrawlerSyncWithNoticeNumberDto,
    [AvailableIntegrations.MileonCrawlerSyncForVehicle]: MileonCrawlerJobDto,
    [AvailableIntegrations.PoliceCrawlerSyncForVehicle]: PoliceCrawlerJobDto,
    [AvailableIntegrations.PoliceCrawlerSyncForVehicleWithCaseNumber]: PoliceCrawlerWithCaseNumberDto,
};

@Injectable()
export class IntegrationFactory {
    constructor(
        private verifyInfringementAutomationIntegration: VerifyInfringementAutomationIntegration,
        private addVehicleAutomationIntegration: AddVehicleAutomationIntegration,
        private updateVehicleAutomationIntegration: UpdateVehicleAutomationIntegration,
        private jerusalemCrawlerInfringementDataService: JerusalemCrawlerSyncIntegrationTest,
        private telavivCrawlerInfringementDataService: TelavivCrawlerSyncIntegrationTest,
        private telavivCrawlerWithNoticeNumberInfringementDataService: TelavivCrawlerSyncWithNoticeNumberIntegrationTest,
        private mileonCrawlerInfringementDataService: MileonCrawlerSyncIntegrationTest,
        private policeCrawlerInfringementDataService: PoliceCrawlerSyncIntegrationTest,
        private policeCrawlerInfringementWithCaseNumberDataService: PoliceCrawlerSyncWithCaseNumberIntegrationTest,
    ) {}

    private integrations = {
        [AvailableIntegrations.ATGVerifyInfringement]: this.verifyInfringementAutomationIntegration,
        [AvailableIntegrations.AddATGVehicle]: this.addVehicleAutomationIntegration,
        [AvailableIntegrations.UpdateATGVehicle]: this.updateVehicleAutomationIntegration,
        [AvailableIntegrations.JerusalemCrawlerSyncForVehicle]: this.jerusalemCrawlerInfringementDataService,
        [AvailableIntegrations.TelavivCrawlerSyncForCustomer]: this.telavivCrawlerInfringementDataService,
        [AvailableIntegrations.TelavivCrawlerSyncForCustomerWithNoticeNumber]: this.telavivCrawlerWithNoticeNumberInfringementDataService,
        [AvailableIntegrations.MileonCrawlerSyncForVehicle]: this.mileonCrawlerInfringementDataService,
        [AvailableIntegrations.PoliceCrawlerSyncForVehicle]: this.policeCrawlerInfringementDataService,
        [AvailableIntegrations.PoliceCrawlerSyncForVehicleWithCaseNumber]: this.policeCrawlerInfringementWithCaseNumberDataService,
    };

    getIntegrationInstance(name: AvailableIntegrations): TestableIntegration {
        return this.integrations[name];
    }

    getIntegrationDto(name: AvailableIntegrations): ClassType<TestableIntegrationDto> {
        return integrationDtoFactory[name];
    }
}

@Injectable()
export class IntegrationTestService {
    constructor(private integrationFactory: IntegrationFactory) {}

    async test(name: AvailableIntegrations, dto: any) {
        if (!integrationDtoFactory[name]) {
            throw new BadRequestException({
                message: ERROR_CODES.E160_UnrecognisedIntegration.message({ name }),
            });
        }
        const typedDto = plainToClass(this.integrationFactory.getIntegrationDto(name), dto);
        const validationErrors = await validate(typedDto);
        if (!isEmpty(validationErrors)) {
            return validationErrors;
        }

        const integration = this.integrationFactory.getIntegrationInstance(name);
        return {
            request: await integration.getBody(typedDto),
            response: await integration.runTest(typedDto),
        };
    }
}
