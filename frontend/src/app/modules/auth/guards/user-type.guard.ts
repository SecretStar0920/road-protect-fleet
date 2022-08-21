import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { some } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import i18next from 'i18next';

@Injectable({
    providedIn: 'root',
})
export class UserTypeGuard implements CanActivate, CanActivateChild {
    constructor(private store: Store<AuthState>, private modalService: NzModalService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const types = next.data.types || [];
        return this.store.select(currentUser).pipe(
            map((user) => {
                return some(types, (type) => type === user.type);
            }),
            tap((result) => {
                if (result === false) {
                    this.modalService.confirm(
                        {
                            nzTitle: i18next.t('user-type-guard.title'),
                            nzCancelText: null,
                        },
                        'warning',
                    );
                }
            }),
        );
    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(next, state);
    }
}
