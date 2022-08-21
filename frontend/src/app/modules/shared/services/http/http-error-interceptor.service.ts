import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { errorNgrxHelper, ErrorState } from '@modules/shared/modules/global-error/ngrx/error.reducer';
import { GlobalError } from '@modules/shared/modules/global-error/ngrx/global-error.model';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private store: Store<ErrorState>) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                this.store.dispatch(errorNgrxHelper.addOne({ item: new GlobalError(error) }));
                return throwError(error);
            }),
        );
    }
}
