import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { InfringementProjectionState } from '@modules/infringement-projection/ngrx/infringement-projection.reducer';
import { InfringementPredictionEndpoints } from '@modules/infringement-projection/services/infringement-projection.service';
import { updateEndpoint } from '@modules/infringement-projection/ngrx/infringement-projection.actions';

@Component({
    selector: 'rp-infringement-projection-owner-page',
    templateUrl: './infringement-projection-owner-page.component.html',
    styleUrls: ['./infringement-projection-owner-page.component.less'],
})
export class InfringementProjectionOwnerPageComponent implements OnInit {
    constructor(private store: Store<InfringementProjectionState>) {}

    ngOnInit() {
        this.store.dispatch(updateEndpoint({ endpoint: InfringementPredictionEndpoints.Owner }));
    }
}
