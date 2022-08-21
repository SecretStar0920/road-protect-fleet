import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationResponderComponent } from './components/notification-responder/notification-responder.component';
import { MinimalSharedModule } from '@modules/minimal-shared/minimal-shared.module';

@NgModule({
    declarations: [NotificationResponderComponent],
    imports: [CommonModule, MinimalSharedModule],
    exports: [NotificationResponderComponent],
})
export class RealtimeModule {}
