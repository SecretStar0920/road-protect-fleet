import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import i18next from 'i18next';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Driver } from '@modules/shared/models/entities/driver.model';
import { DriverService } from '@modules/admin-driver/services/driver.service';

@Component({
    selector: 'rp-delete-driver',
    templateUrl: './delete-driver.component.html',
    styleUrls: ['./delete-driver.component.less'],
})
export class DeleteDriverComponent implements OnInit, OnDestroy {
    @Input() driverId: number;
    private destroy$ = new Subject();

    deleteDriverState: ElementStateModel<Driver> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Driver>> = new EventEmitter();

    constructor(private driverService: DriverService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteDriverState.submit();
        this.driverService
            .deleteDriver(this.driverId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (driver) => {
                    this.deleteDriverState.onSuccess(i18next.t('delete-driver.success'), driver);
                    this.message.success(this.deleteDriverState.successResult().message);
                    this.delete.emit(this.deleteDriverState);
                },
                (error) => {
                    this.deleteDriverState.onFailure(i18next.t('delete-driver.fail'), error);
                    this.message.error(this.deleteDriverState.failedResult().message);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
