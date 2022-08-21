import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocationService } from '@modules/location/services/location.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Location } from '@modules/shared/models/entities/location.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-create-location',
    templateUrl: './create-location.component.html',
    styleUrls: ['./create-location.component.less'],
})
export class CreateLocationComponent implements OnInit {
    createLocationForm: FormGroup;
    createLocationState: ElementStateModel<Location> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    get f() {
        return this.createLocationForm.controls;
    }

    constructor(private locationService: LocationService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createLocationForm = this.fb.group({
            // name: new FormControl('', Validators.required),
            // identifier: new FormControl('', Validators.required)
        });
    }

    onCreateLocation() {
        this.createLocationState.submit();
        this.locationService.createLocation(this.createLocationForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully created Location', result);
                this.createLocationState.onSuccess(i18next.t('create-location.success'), result);
                this.complete.emit(this.createLocationState);
            },
            (error) => {
                this.logger.error('Failed to create Location', error);
                this.createLocationState.onFailure(i18next.t('create-location.fail'), error.error);
                this.complete.emit(this.createLocationState);
            },
        );
    }
}
