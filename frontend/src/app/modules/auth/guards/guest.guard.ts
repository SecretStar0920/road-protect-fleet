import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState, currentToken } from '@modules/auth/ngrx/auth.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class GuestGuard implements CanActivate, CanActivateChild {
    constructor(private store: Store<AuthState>, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store.select(currentToken).pipe(
            map((token) => {
                return true;
                // if (token && state.url !== '/login') {
                //     this.router.navigateByUrl(state.url);
                //     return false;
                // }
                //
                // return true;
            }),
        );
    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(next, state);
    }
}
