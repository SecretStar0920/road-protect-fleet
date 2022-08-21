import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportAllButtonComponent } from './components/export-all-button/export-all-button.component';
import { SharedModule } from '@modules/shared/shared.module';
import { I18NextModule } from 'angular-i18next';

@NgModule({
    declarations: [ExportAllButtonComponent],
    imports: [CommonModule, SharedModule, I18NextModule],
    exports: [ExportAllButtonComponent],
})
export class SpreadsheetModule {}
