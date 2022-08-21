import { ATGTicketRequest } from '@modules/integration-test/models/atg-ticket-request.dto';
import { AtgVehicleRequest } from '@modules/integration-test/models/atg-vehicle-request.dto';
import {
    JerusalemCrawlerSyncDto,
    MileonCrawlerSyncDto,
    PoliceCrawlerSyncDto,
    PoliceCrawlerWithCaseNumberSyncDto,
    TelavivCrawlerSyncDto,
    TelavivCrawlerWithNoticeNumberJobDto,
} from '@modules/integration-test/models/crawler-request.dto';

export interface Field {
    control: string;
    label: string;
}

export abstract class IntegrationTestModel {
    abstract fields: Field[];
}

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

export const integrationDtoFactory = {
    [AvailableIntegrations.ATGVerifyInfringement]: ATGTicketRequest,
    [AvailableIntegrations.AddATGVehicle]: AtgVehicleRequest,
    [AvailableIntegrations.UpdateATGVehicle]: AtgVehicleRequest,
    [AvailableIntegrations.JerusalemCrawlerSyncForVehicle]: JerusalemCrawlerSyncDto,
    [AvailableIntegrations.TelavivCrawlerSyncForCustomer]: TelavivCrawlerSyncDto,
    [AvailableIntegrations.TelavivCrawlerSyncForCustomerWithNoticeNumber]: TelavivCrawlerWithNoticeNumberJobDto,
    [AvailableIntegrations.MileonCrawlerSyncForVehicle]: MileonCrawlerSyncDto,
    [AvailableIntegrations.PoliceCrawlerSyncForVehicle]: PoliceCrawlerSyncDto,
    [AvailableIntegrations.PoliceCrawlerSyncForVehicleWithCaseNumber]: PoliceCrawlerWithCaseNumberSyncDto,
};

export class IntegrationFactory {
    static get(name: AvailableIntegrations): IntegrationTestModel {
        return new integrationDtoFactory[name]();
    }
}
