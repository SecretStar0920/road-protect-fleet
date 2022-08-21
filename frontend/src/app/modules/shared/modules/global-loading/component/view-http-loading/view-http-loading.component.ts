import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { GlobalLoadingState } from '@modules/shared/modules/global-loading/ngrx/global-loading.reducer';
import { getInProgressCount, isHttpLoading } from '@modules/shared/modules/global-loading/ngrx/global-loading.selectors';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'rp-view-http-loading',
    templateUrl: './view-http-loading.component.html',
    styleUrls: ['./view-http-loading.component.less'],
})
export class ViewHttpLoadingComponent implements OnInit {
    isLoading = this.store.pipe(select(isHttpLoading), debounceTime(50));
    requestCount = this.store.pipe(select(getInProgressCount), debounceTime(50));

    constructor(private store: Store<GlobalLoadingState>) {}

    ngOnInit() {}
}
