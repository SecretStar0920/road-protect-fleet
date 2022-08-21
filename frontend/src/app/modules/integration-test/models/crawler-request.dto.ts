import { Field, IntegrationTestModel } from '@modules/integration-test/models/integration-test.model';

export class JerusalemCrawlerSyncDto implements IntegrationTestModel {
    registration: string;
    identifier: string;
    fields: Field[] = [
        { control: 'registration', label: 'Car Registration' },
        { control: 'identifier', label: 'BRN/Customer' },
    ];
}
export class TelavivCrawlerSyncDto implements IntegrationTestModel {
    identifier: string;
    fields: Field[] = [{ control: 'identifier', label: 'BRN/Customer' }];
}
export class TelavivCrawlerWithNoticeNumberJobDto implements IntegrationTestModel {
    identifier: string;
    fields: Field[] = [
        { control: 'identifier', label: 'BRN/Customer' },
        { control: 'noticeNumber', label: 'Notice Number' },
        { control: 'registration', label: 'Car Registration' },
    ];
}
export class MileonCrawlerSyncDto implements IntegrationTestModel {
    registration: string;
    issuerIdentifier: string;
    fields: Field[] = [
        { control: 'registration', label: 'Car Registration' },
        { control: 'issuerIdentifier', label: 'Issuer Name/Code' },
    ];
}
export class PoliceCrawlerSyncDto implements IntegrationTestModel {
    identifier: string;
    fields: Field[] = [{ control: 'identifier', label: 'BRN/Customer' }];
}
export class PoliceCrawlerWithCaseNumberSyncDto implements IntegrationTestModel {
    identifier: string;
    fields: Field[] = [
        { control: 'identifier', label: 'BRN/Customer' },
        { control: 'caseNumber', label: 'Case Number' },
    ];
}
