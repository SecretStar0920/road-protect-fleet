import { Component, OnDestroy, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { mergeMap, take, takeUntil } from 'rxjs/operators';
import { EMPTY, of, Subject } from 'rxjs';
import { Account, AccountRole } from '@modules/shared/models/entities/account.model';
import { AccountService } from '@modules/account/services/account.service';
import { isNil } from 'lodash';
import { vehicleNgrxHelper } from '@modules/vehicle/ngrx/vehicle.reducer';
import { resetInfringementQueryParameters } from '@modules/infringement/ngrx/infringement.actions';

@Component({
    selector: 'rp-view-account-vehicles',
    templateUrl: './view-account-vehicles.component.html',
    styleUrls: ['./view-account-vehicles.component.less'],
})
export class ViewAccountVehiclesComponent implements OnInit, OnDestroy {
    accountId: number;
    account: Account;

    showAll: boolean = true;
    show: { fleet: boolean; owned: boolean; all: boolean } = {
        fleet: false,
        owned: false,
        all: false,
    };
    private destroy$ = new Subject();

    constructor(
        private logger: NGXLogger,
        private modalService: NzModalService,
        private activatedRoute: ActivatedRoute,
        private store: Store<AppState>,
        private accountService: AccountService,
    ) {}

    ngOnInit() {
        this.store
            .pipe(
                select(getSelectedAccount),
                mergeMap((result: { id: number; account: Account }) => {
                    this.accountId = result.id;
                    if (isNil(result.account)) {
                        if (result.id) {
                            return this.accountService.getAccount(result.id);
                        } else {
                            return EMPTY;
                        }
                    } else {
                        return of(result.account);
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((account) => {
                this.account = account;
                this.canViewFleet();
            });

        this.onChangeTabs();
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetInfringementQueryParameters());
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    onChangeTabs() {
        this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {
            if (params.tab === 'fleet') {
                this.store.dispatch(
                    vehicleNgrxHelper.setQueryParams({
                        query: {
                            mine: true,
                            via: 'using',
                        },
                    }),
                );
            } else if (params.tab === 'owned') {
                this.store.dispatch(
                    vehicleNgrxHelper.setQueryParams({
                        query: {
                            mine: true,
                            via: 'owned',
                        },
                    }),
                );
            } else {
                // Default to all
                this.store.dispatch(
                    vehicleNgrxHelper.setQueryParams({
                        query: {
                            mine: true,
                            via: 'all',
                        },
                    }),
                );
            }
        });
    }

    canViewFleet() {
        this.show = {
            fleet: false,
            owned: false,
            all: false,
        };
        const role = this.account.role;

        if (role === AccountRole.Hybrid) {
            this.show.fleet = true;
            this.show.owned = true;
            this.show.all = true;
        } else if (role === AccountRole.User) {
            this.show.fleet = true;
        } else if (role === AccountRole.Owner) {
            this.show.owned = true;
        }

        if (this.showAll) {
            this.show.fleet = true;
            this.show.owned = true;
            this.show.all = true;
        }
    }
    //
    // onShowAll() {
    //     this.showAll = !this.showAll;
    //     this.canViewFleet();
    // }
}
