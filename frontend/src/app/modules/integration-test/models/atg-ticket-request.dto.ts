import { Field, IntegrationTestModel } from '@modules/integration-test/models/integration-test.model';

export class ATGTicketRequest implements IntegrationTestModel {
    customer: string;
    ticketNumber: string;
    carNumber: string;
    fields: Field[] = [
        { control: 'customer', label: 'ATG Issuer Code' },
        { control: 'ticketNumber', label: 'Notice Number' },
        { control: 'carNumber', label: 'Car Registration' },
    ];
}
