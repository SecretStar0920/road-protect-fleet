import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import i18next from 'i18next';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { NominationService } from '@modules/nomination/services/nomination.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AppState } from '../../../../ngrx/app.reducer';
import { Store } from '@ngrx/store';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { Socket } from 'ngx-socket-io';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MunicipalRedirectionDetails } from '@modules/infringement/components/check-nomination-redirection-details/municipal-redirection.details';
import { nominationNgrxHelper } from '@modules/nomination/ngrx/nomination.reducer';

@Component({
    selector: 'rp-municipally-redirect-nomination',
    templateUrl: './municipally-redirect-nomination.component.html',
    styleUrls: ['./municipally-redirect-nomination.component.less'],
})
export class MunicipallyRedirectNominationComponent implements OnInit, OnDestroy {
    private _nomination: Nomination;
    get nomination(): Nomination {
        return this._nomination;
    }

    @Input()
    set nomination(value: Nomination) {
        this._nomination = value;
        this.infringement = this._nomination.infringement;
        this.vehicle = this._nomination.infringement.vehicle;
    }

    infringement: Infringement;
    vehicle: Vehicle;

    redirectState: ElementStateModel<any, any> = new ElementStateModel<any, any>();

    details: MunicipalRedirectionDetails;

    progressMessages: { message: string; type: string }[] = [];

    stepper = new Stepper([
        new Step({ title: i18next.t('municipally-redirect-nomination.check_details') }), // check the details
        // new Step({ title: i18next.t('municipally-redirect-nomination.step_1') }), // start
        new Step({ title: i18next.t('municipally-redirect-nomination.step_2') }), // loading
        new Step({ title: i18next.t('municipally-redirect-nomination.step_3') }), // result
    ]);

    destroy$ = new Subject();

    constructor(
        private nominationService: NominationService,
        private infringementService: InfringementService,
        private store: Store<AppState>,
        private socket: Socket,
    ) {}

    ngOnInit() {
        this.socket
            .fromEvent('municipal-redirection')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: { message: string; type: string }) => {
                this.progressMessages.push(result);
            });
    }

    redirect() {
        this.redirectState.submit();
        this.progressMessages = [];
        this.nominationService.municipallyRedirectNominationReq(this.nomination.nominationId).subscribe(
            (result) => {
                this.redirectState.onSuccess('Successfully nominated', result);
                this.store.dispatch(nominationNgrxHelper.upsertOne({ item: result }));
                this.stepper.next();
            },
            (error) => {
                this.redirectState.onFailure(error.error.message, error.error.context);
                this.stepper.next();
            },
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onDetailsChecked(details: MunicipalRedirectionDetails) {
        this.details = details;
    }

    onStartFlow() {
        this.stepper.next();
        this.redirect();
    }
}
