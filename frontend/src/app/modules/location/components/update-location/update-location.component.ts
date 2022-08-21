import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@modules/shared/models/entities/location.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { LocationService } from '@modules/location/services/location.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';

@Component({
    selector: 'rp-update-location',
    templateUrl: './update-location.component.html',
    styleUrls: ['./update-location.component.less'],
})
export class UpdateLocationComponent implements OnInit {
    @Input() location: Location;

    updateLocationForm: FormGroup;
    updateLocationState: ElementStateModel<Location> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Location>> = new EventEmitter();

    get f() {
        return this.updateLocationForm.controls;
    }

    constructor(private locationService: LocationService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateLocationForm = this.fb.group({
            // name: new FormControl(this.location.name, Validators.required),
            // identifier: new FormControl(this.location.identifier, Validators.required),
        });
    }

    onUpdateLocation() {
        this.updateLocationState.submit();
        this.locationService.updateLocation(this.location.locationId, this.updateLocationForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully updated Location', result);
                this.updateLocationState.onSuccess(i18next.t('update-location.success'), result);
                this.complete.emit(this.updateLocationState);
            },
            (error) => {
                this.logger.error('Failed to update Location', error);
                this.updateLocationState.onFailure(i18next.t('update-location.fail'), error.error);
                this.complete.emit(this.updateLocationState);
            },
        );
    }
}
