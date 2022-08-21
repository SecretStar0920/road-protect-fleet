import { Field, IntegrationTestModel } from '@modules/integration-test/models/integration-test.model';

export class AtgVehicleRequest implements IntegrationTestModel {
    vehicleId: string;
    startTime: string;
    endTime: string;
    fields: Field[] = [
        { control: 'vehicleId', label: 'Car Registration' },
        { control: 'startTime', label: 'Contract Start Date (YYYY-MM-DD)' },
        { control: 'endTime', label: 'Contract Start Date (YYYY-MM-DD)' },
    ];
}
