import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AvailableIntegrations, IntegrationFactory } from '@modules/integration-test/models/integration-test.model';
import { IntegrationTestService } from '@modules/integration-test/services/integration-test.service';
import { keys, values } from 'lodash';

@Component({
    selector: 'rp-integration-test',
    templateUrl: './integration-test.component.html',
    styleUrls: ['./integration-test.component.less'],
})
export class IntegrationTestComponent implements OnInit {
    availableIntegrations = values(AvailableIntegrations);
    selectedIntegration: AvailableIntegrations;
    form: FormGroup;
    response: any;
    loading: boolean = false;
    selectedIntegrationControlLabels: { [key: string]: string } = {};

    constructor(private integrationService: IntegrationTestService) {}

    ngOnInit() {}

    onIntegrationSelected(integration: AvailableIntegrations) {
        this.selectedIntegrationControlLabels = {};
        const selectedIntegrationDto = IntegrationFactory.get(integration);
        const group = {};
        selectedIntegrationDto.fields.forEach((property) => {
            group[property.control] = new FormControl();
            this.selectedIntegrationControlLabels[property.control] = property.label;
        });
        this.form = new FormGroup(group);
    }

    get controls(): string[] {
        return keys(this.form.controls);
    }

    submitForm() {
        this.loading = true;
        const dto = this.form.value;
        this.integrationService.post(this.selectedIntegration, dto).subscribe(
            (data) => {
                this.response = data ? data : 'null';
                this.loading = false;
            },
            (error) => {
                this.response = error;
                this.loading = false;
            },
        );
    }
}
