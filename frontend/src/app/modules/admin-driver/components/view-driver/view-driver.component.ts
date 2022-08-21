import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { driverNgrxHelper, DriverState } from '@modules/admin-driver/ngrx/driver.reducer';
import { Driver } from '@modules/shared/models/entities/driver.model';
import { DriverService } from '@modules/admin-driver/services/driver.service';
import { UserType } from '@modules/shared/models/entities/user.model';

@Component({
    selector: 'rp-view-driver',
    templateUrl: './view-driver.component.html',
    styleUrls: ['./view-driver.component.less'],
})
export class ViewDriverComponent implements OnInit, OnDestroy {
    @Input() driverId: number;
    driver: Driver;
    @Output() delete: EventEmitter<ElementStateModel<Driver>> = new EventEmitter();

    private destroy$ = new Subject();

    constructor(private store: Store<DriverState>, private logger: NGXLogger, private driverService: DriverService) {}

    ngOnInit() {
        this.getDriver();
    }

    getDriver() {
        this.store
            .pipe(
                select(driverNgrxHelper.selectEntityById(this.driverId), takeUntil(this.destroy$)),
                tap((driver) => {
                    if (!driver) {
                        this.logger.debug('Driver not found on store, querying for it');
                        this.driverService.getDriver(this.driverId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.driver = result;
            });
    }

    onDelete(deleteState: ElementStateModel<Driver>) {
        this.delete.emit(deleteState);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
