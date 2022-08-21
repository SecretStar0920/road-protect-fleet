import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http.service';
import { AppState } from '../../../ngrx/app.reducer';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { InfringementNote } from '@modules/shared/models/entities/infringement-note.model';
import * as actions from '@modules/infringement-note/ngrx/infringement-note.actions';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateInfringementNoteDto {
    // Insert Properties
}

export class CreateInfringementNoteDto {
    @IsString()
    value: string;

    @IsNumber()
    infringementId: number;

    @IsBoolean()
    adminNote: boolean = false;
}

@Injectable({
    providedIn: 'root',
})
export class InfringementNoteService {
    constructor(private http: HttpService, private store: Store<AppState>) {}

    getAllInfringementNotes() {
        return this.http.getSecure('infringement-note').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(InfringementNote, item));
                }
                return [];
            }),
            tap((infringementNotes) => {
                this.store.dispatch(actions.loadInfringementNotes({ infringementNotes }));
            }),
        );
    }

    getInfringementNotesByInfringementId(infringementId: number) {
        return this.http.getSecure(`infringement-note/infringement/${infringementId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(InfringementNote, item));
                }
                return [];
            }),
            tap((infringementNotes) => {
                this.store.dispatch(actions.loadInfringementNotes({ infringementNotes }));
            }),
        );
    }

    getInfringementNote(infringementNoteId: number) {
        return this.http.getSecure(`infringement-note/${infringementNoteId}`).pipe(
            map((response: object) => {
                return plainToClass(InfringementNote, response);
            }),
            tap((infringementNote) => {
                this.store.dispatch(actions.upsertInfringementNote({ infringementNote }));
            }),
        );
    }

    createInfringementNote(dto: CreateInfringementNoteDto): Observable<InfringementNote> {
        return this.http.postSecure('infringement-note', dto).pipe(
            map((response: object) => {
                return plainToClass(InfringementNote, response);
            }),
            tap((result) => {
                this.store.dispatch(actions.addInfringementNote({ infringementNote: result }));
            }),
        );
    }

    updateInfringementNote(id: number, dto: UpdateInfringementNoteDto): Observable<InfringementNote> {
        return this.http.postSecure(`infringement-note/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(InfringementNote, response);
            }),
            tap((result) => {
                this.store.dispatch(
                    actions.updateInfringementNote({ infringementNote: { id: result.infringementNoteId, changes: result } }),
                );
            }),
        );
    }

    deleteInfringementNote(infringementNoteId: number) {
        return this.http.deleteSecure(`infringement-note/${infringementNoteId}`).pipe(
            map((response: object) => {
                return plainToClass(InfringementNote, response);
            }),
            tap((infringementNote) => {
                this.store.dispatch(actions.deleteInfringementNote({ id: `${infringementNote.infringementNoteId}` }));
            }),
        );
    }
}
