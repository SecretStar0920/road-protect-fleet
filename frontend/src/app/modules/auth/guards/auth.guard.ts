import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState, currentToken } from '@modules/auth/ngrx/auth.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from '@modules/auth/services/auth.service';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private store: Store<AuthState>,
        private authService: AuthService,
        private jwtHelper: JwtHelperService = new JwtHelperService(),
        private router: Router,
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store.select(currentToken).pipe(
            map((token) => {
                if (!token) {
                    this.authService.logout();
                    return false;
                }

                if (this.jwtHelper.isTokenExpired(token)) {
                    this.authService.logout();
                    return false;
                }

                return true;
            }),
            tap((result) => {
                if (result === false) {
                    this.router.navigate(['/login']);
                }
            }),
        );
    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(next, state);
    }
}
