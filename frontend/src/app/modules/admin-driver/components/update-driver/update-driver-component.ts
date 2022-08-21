import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DriverService } from '@modules/admin-driver/services/driver.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Driver } from '@modules/shared/models/entities/driver.model';
import { NGXLogger } from 'ngx-logger';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';

type State = {
    driver?: Driver
    loading: boolean
    updating: boolean
    error?: {
        message: string,
        description: string,
    }
}

@Component({
    selector: 'rp-update-driver',
    templateUrl: './update-driver.component.html',
    styleUrls: ['./update-driver.component.less'],
})
export class UpdateDriverComponent implements OnInit, OnDestroy {
    @Input() driverId: number;
    @Input() driver?: Driver = null;

    state: State

    reloadSubscription?: Subscription

    destroy$ = new Subject();
    updateDriverForm: FormGroup;
    @Output() complete: EventEmitter<boolean> = new EventEmitter();

    get f() {
        return this.updateDriverForm.controls;
    }

    constructor(private driverService: DriverService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.state = {
            driver: this.driver,
            loading: false,
            updating: false,
            error: null
        }

        this.updateDriverForm = this.fb.group({
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

        this.reloadDriverIfNeeded()
    }

    private reloadDriverIfNeeded() {
        if (this.state.driver === null) {
            this.reloadDriver()
        } else {
            this.onDriverReady(this.state.driver)
        }
    }

    private reloadDriver() {
        this.reloadSubscription?.unsubscribe()

        this.state.loading = true
        this.reloadSubscription = this.driverService.getDriver(this.driverId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((driver) => {
                this.state.loading = false
                this.onDriverReady(driver)
            }, (error) => {
                this.state.loading = false
                this.onFetchingDriverFailed(error)
            })
    }

    private onDriverReady(driver: Driver) {
        this.state.error = null
        this.state.driver = driver

        this.inflateForm(driver)
    }

    private inflateForm(driver: Driver) {
        this.updateDriverForm = this.fb.group({
            driverId: new FormControl(driver.driverId, Validators.required),
            name: new FormControl(driver.name, Validators.required),
            surname: new FormControl(driver.surname, Validators.required),
            idNumber: new FormControl(driver.idNumber, Validators.required),
            licenseNumber: new FormControl(driver.licenseNumber, Validators.required),
            cellphoneNumber: new FormControl(driver.cellphoneNumber),
            email: new FormControl(driver.email, [Validators.email, Validators.required]),
            postalLocation: new FormGroup({
                city: new FormControl(driver.postalLocation.city, Validators.required),
                country: new FormControl(driver.postalLocation.country, Validators.required),
                code: new FormControl(driver.postalLocation.code),
                postOfficeBox: new FormControl(driver.postalLocation.postOfficeBox, Validators.required),
            })
        });
    }

    private onFetchingDriverFailed(error: Error) {
        this.state.error = {
            message: '',
            description: error.message,
        }
    }

    locationIsValid() {
        return this.updateDriverForm.get('physicalLocation').valid ||
               this.updateDriverForm.get('postalLocation').valid;
    }

    isValid() {
        console.log('IsValid', this.updateDriverForm.valid, this.locationIsValid())
        return this.updateDriverForm.valid && this.locationIsValid();
    }

    onCreateDriver() {
        this.state.updating = true

        const driverId = this.state.driver?.driverId
        if (isNil(driverId)) {
            return
        }

        this.driverService
            .updateDriver(driverId, this.updateDriverForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.state.updating = false
                    this.logger.info('Successfully created a Driver', result);
                    this.complete.emit(true);
                },
                (error) => {
                    this.state.updating = false
                    this.logger.error('Failed to update a Driver', error);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
