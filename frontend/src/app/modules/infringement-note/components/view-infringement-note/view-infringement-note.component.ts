import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { InfringementNoteService } from '@modules/infringement-note/services/infringement-note.service';
import { getInfringementNoteById } from '@modules/infringement-note/ngrx/infringement-note.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InfringementNote } from '@modules/shared/models/entities/infringement-note.model';
import * as moment from 'moment';

@Component({
    selector: 'rp-view-infringement-note',
    templateUrl: './view-infringement-note.component.html',
    styleUrls: ['./view-infringement-note.component.less'],
})
export class ViewInfringementNoteComponent implements OnInit, OnDestroy {
    @Input() infringementNoteId: number;
    infringementNote: InfringementNote;

    private destroy$ = new Subject();

    constructor(private store: Store<AppState>, private infringementNoteService: InfringementNoteService) {}

    ngOnInit() {
        // this.infringementNoteService.getInfringementNote(this.infringementNoteId).subscribe();
        this.store.pipe(select(getInfringementNoteById(this.infringementNoteId)), takeUntil(this.destroy$)).subscribe((result) => {
            this.infringementNote = result;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    getDate() {
        return moment(this.infringementNote.createdAt).format('YYYY-MM-DD');
    }

    onDelete() {
        this.infringementNoteService.deleteInfringementNote(this.infringementNoteId).pipe(takeUntil(this.destroy$)).subscribe();
    }
}
