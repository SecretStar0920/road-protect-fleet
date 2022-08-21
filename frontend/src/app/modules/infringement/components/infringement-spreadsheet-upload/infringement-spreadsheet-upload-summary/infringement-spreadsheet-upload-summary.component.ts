import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { Observable } from 'rxjs';
import { AdminInfringementUpload } from '@modules/infringement/ngrx/admin-infringement-upload.interface';
import { adminInfringementUpload } from '@modules/infringement/ngrx/infringement.selectors';
import { takeWhile } from 'rxjs/operators';
import { redirectMissingInfringementsReset } from '@modules/infringement/ngrx/infringement.actions';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-infringement-spreadsheet-upload-summary',
    templateUrl: './infringement-spreadsheet-upload-summary.component.html',
    styleUrls: ['./infringement-spreadsheet-upload-summary.component.less'],
})
export class InfringementSpreadsheetUploadSummaryComponent implements OnInit {
    infringementUpload$: Observable<AdminInfringementUpload>;
    alive = true;

    constructor(private store$: Store<InfringementState>, private router: Router) {}

    ngOnInit(): void {
        this.infringementUpload$ = this.store$.select(adminInfringementUpload).pipe(takeWhile(() => this.alive));
    }

    onDone() {
        this.store$.dispatch(redirectMissingInfringementsReset());
        this.router
            .navigateByUrl('/', {
                skipLocationChange: true,
            })
            .then(() => {
                this.router.navigate(['/home/infringements/upload']);
            });
    }
}
