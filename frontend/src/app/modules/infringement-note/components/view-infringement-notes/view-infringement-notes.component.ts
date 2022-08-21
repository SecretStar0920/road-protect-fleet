import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InfringementNote } from '@modules/shared/models/entities/infringement-note.model';
import { InfringementNoteService } from '@modules/infringement-note/services/infringement-note.service';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { getInfringementNotesByInfringementId } from '@modules/infringement-note/ngrx/infringement-note.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { get } from 'lodash';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { AuthState, currentUser } from '@modules/auth/ngrx/auth.reducer';

@Component({
    selector: 'rp-view-infringement-notes',
    templateUrl: './view-infringement-notes.component.html',
    styleUrls: ['./view-infringement-notes.component.less'],
})
export class ViewInfringementNotesComponent implements OnInit, OnDestroy {
    @Input()
    infringementId: number;
    standardNotes: InfringementNote[] = [];
    adminNotes: InfringementNote[] = [];

    private destroy$ = new Subject();
    showCreateModal: boolean = false;
    showCreateAdminModal: boolean = false;
    createNoteForm: FormGroup;
    createAdminNoteForm: FormGroup;

    user: User;

    constructor(
        private infringementNoteService: InfringementNoteService,
        private store: Store<AppState>,
        private authStore: Store<AuthState>
    ) {}

    ngOnInit() {
        this.infringementNoteService.getInfringementNotesByInfringementId(this.infringementId).subscribe();
        this.store.pipe(select(getInfringementNotesByInfringementId(this.infringementId)), takeUntil(this.destroy$)).subscribe((result) => {
            this.standardNotes = result.filter((note) => !note.adminNote);
            this.adminNotes = result.filter((note) => note.adminNote);;
        });

        this.resetNoteForm()
        this.resetAdminNoteForm()

        this.authStore.pipe(select(currentUser), takeUntil(this.destroy$)).subscribe((user) => {
            this.user = user;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onShowCreateNote() {
        this.resetNoteForm()
        this.showCreateModal = true;
    }

    onShowCreateAdminNote() {
        this.resetAdminNoteForm()
        this.showCreateAdminModal = true;
    }

    onCreateNote() {
        if (get(this.createNoteForm, ['value', 'value']).length <= 0) {
            return;
        }

        this.infringementNoteService.createInfringementNote(this.createNoteForm.value).subscribe((result) => {
            this.closeCreateNoteModal();
        });
    }

    onCreateAdminNote() {
        if (get(this.createAdminNoteForm, ['value', 'value']).length <= 0) {
            return;
        }

        this.infringementNoteService.createInfringementNote(this.createAdminNoteForm.value).subscribe((result) => {
            this.closeCreateAdminModal();
        });
    }

    closeCreateNoteModal() {
        this.showCreateModal = false;
    }

    closeCreateAdminModal() {
        this.showCreateAdminModal = false;
    }

    get adminNotesAraAvailable(): boolean {
        return this.user?.type === UserType.Admin || this.user?.type === UserType.Developer;
    }

    private resetNoteForm() {
        this.createNoteForm = new FormGroup({
            value: new FormControl('', Validators.required),
            infringementId: new FormControl(this.infringementId, Validators.required),
            adminNote: new FormControl(false, Validators.required),
        });
    }

    private resetAdminNoteForm() {
        this.createAdminNoteForm = new FormGroup({
            value: new FormControl('', Validators.required),
            infringementId: new FormControl(this.infringementId, Validators.required),
            adminNote: new FormControl(true, Validators.required),
        });
    }
}
