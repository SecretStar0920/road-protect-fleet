import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { issuerNgrxHelper, IssuerState } from '@modules/issuer/ngrx/issuer.reducer';
import { select, Store } from '@ngrx/store';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { IssuerService } from '@modules/issuer/services/issuer.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { UserType } from '@modules/shared/models/entities/user.model';

@Component({
    selector: 'rp-view-issuer',
    templateUrl: './view-issuer.component.html',
    styleUrls: ['./view-issuer.component.less'],
})
export class ViewIssuerComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() issuerId: number;
    issuer: Issuer;

    updateIssuerState: ElementStateModel<Issuer> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Issuer>> = new EventEmitter();

    private destroy$ = new Subject();

    userTypes = UserType;

    constructor(private store: Store<IssuerState>, private logger: NGXLogger, private issuerService: IssuerService) {}

    ngOnInit() {
        this.getIssuer();
    }

    getIssuer() {
        this.store
            .pipe(
                select(issuerNgrxHelper.selectEntityById(this.issuerId), takeUntil(this.destroy$)),
                tap((issuer) => {
                    if (!issuer) {
                        this.logger.debug('Issuer not found on store, querying for it');
                        this.issuerService.getIssuer(this.issuerId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.issuer = result;
            });
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<Issuer>) {
        this.onUpdate();
        this.updateIssuerState = state;
    }

    onDelete(deleteState: ElementStateModel<Issuer>) {
        this.destroy$.next();
        if (deleteState.hasSucceeded()) {
            this.delete.emit(deleteState);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
