import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalLoadingState } from '@modules/shared/modules/global-loading/ngrx/global-loading.reducer';
import { addRequest, completeRequest } from '@modules/shared/modules/global-loading/ngrx/global-loading.actions';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
    constructor(private store: Store<GlobalLoadingState>) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.store.dispatch(addRequest());
        return next.handle(request).pipe(
            finalize(() => {
                this.store.dispatch(completeRequest());
            }),
        );
    }
}
