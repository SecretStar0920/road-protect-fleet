import * as fromLog from '@modules/log/ngrx/log.reducer';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ViewLogsComponent } from '@modules/log/components/view-logs/view-logs.component';
import { LogEffects } from '@modules/log/ngrx/log.effects';
import { I18NextModule } from 'angular-i18next';
import { LogTimelineComponent } from '@modules/log/components/log-timeline/log-timeline.component';
import { LogKeysMapper } from '@modules/log/components/log-timeline/log-keys.mapper';

@NgModule({
    declarations: [ViewLogsComponent, LogTimelineComponent],
    providers: [LogKeysMapper],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('log', fromLog.reducer),
        EffectsModule.forFeature([LogEffects]),
        I18NextModule,
    ],
    exports: [ViewLogsComponent],
    entryComponents: [],
})
export class LogModule {}
