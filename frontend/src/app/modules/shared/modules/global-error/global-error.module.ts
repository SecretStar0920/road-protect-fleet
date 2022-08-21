import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromError from './ngrx/error.reducer';
import { ErrorDisplayComponent } from './components/error-display/error-display.component';
import { MinimalSharedModule } from '@modules/minimal-shared/minimal-shared.module';

@NgModule({
    declarations: [ErrorDisplayComponent],
    imports: [CommonModule, MinimalSharedModule, StoreModule.forFeature('error', fromError.reducer)],
    exports: [ErrorDisplayComponent],
})
export class GlobalErrorModule {}
