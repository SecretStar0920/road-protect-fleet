import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import * as fromInfringementNote from './ngrx/infringement-note.reducer';
import { ViewInfringementNoteComponent } from './components/view-infringement-note/view-infringement-note.component';
import { ViewInfringementNotesComponent } from './components/view-infringement-notes/view-infringement-notes.component';

@NgModule({
    declarations: [ViewInfringementNoteComponent, ViewInfringementNotesComponent],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature(fromInfringementNote.infringementNotesFeatureKey, fromInfringementNote.reducer),
    ],
    exports: [ViewInfringementNoteComponent, ViewInfringementNotesComponent],
})
export class InfringementNoteModule {}
