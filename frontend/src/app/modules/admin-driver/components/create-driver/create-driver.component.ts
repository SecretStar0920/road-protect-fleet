import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import i18next from 'i18next';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Driver } from '@modules/shared/models/entities/driver.model';
import { DriverService } from '@modules/admin-driver/services/driver.service';
import { get } from 'lodash';

@Component({
    selector: 'rp-create-driver',
    templateUrl: './create-driver.component.html',
    styleUrls: ['./create-driver.component.less'],
})
export class CreateDriverComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();
    createDriverForm: FormGroup;
    createDriverState: ElementStateModel<Driver> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    get f() {
        return this.createDriverForm.controls;
    }

    constructor(private driverService: DriverService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createDriverForm = this.fb.group({
            name: new FormControl(null, Validators.required),
            surname: new FormControl(null, Validators.required),
            idNumber: new FormControl(null, Validators.required),
            licenseNumber: new FormControl(null, Validators.required),
            cellphoneNumber: new FormControl(),
            email: new FormControl(null, [Validators.email, Validators.required]),
            postalLocation: new FormGroup({
                city: new FormControl(null, Validators.required),
                country: new FormControl(null, Validators.required),
                code: new FormControl(null),
                postOfficeBox: new FormControl(null, Validators.required),
            }),
        });
    }

    locationIsValid() {
        return (
            get(this.createDriverForm, 'controls.physicalLocation.valid', false) ||
            get(this.createDriverForm, 'controls.postalLocation.valid', false)
        );
    }

    isValid() {
        return this.createDriverForm.valid && this.locationIsValid();
    }

    onCreateDriver() {
        this.createDriverState.submit();
        this.driverService
            .createDriver(this.createDriverForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully created a Driver', result);
                    this.createDriverState.onSuccess(i18next.t('create-driver.success'), result);
                    this.complete.emit(this.createDriverState);
                },
                (error) => {
                    this.logger.error('Failed to create a Driver', error);
                    this.createDriverState.onFailure(i18next.t('create-driver.fail'), error.error);
                    this.complete.emit(this.createDriverState);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
