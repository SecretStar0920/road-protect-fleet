import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { logoutAction } from '@modules/auth/ngrx/auth.actions';
import { Store } from '@ngrx/store';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AppState } from '../../../../../../ngrx/app.reducer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { infringementNgrxHelper, InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { plainToClass } from 'class-transformer';
import { Infringement } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-notification-responder',
    templateUrl: './notification-responder.component.html',
    styleUrls: ['./notification-responder.component.less'],
})
export class NotificationResponderComponent implements OnInit, OnDestroy {
    @ViewChild('missingTranslations')
    missingTranslationTemplate: TemplateRef<any>;

    destroy$ = new Subject();

    constructor(
        private modal: NzModalService,
        private notification: NzNotificationService,
        private socket: Socket,
        private store: Store<AppState>,
        private router: Router,
        private infringementStore: Store<InfringementState>,
    ) {}

    ngOnInit() {
        this.socket
            .fromEvent('notification')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.notification.info('System Notification', result.message);
            });

        this.socket
            .fromEvent('logout')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.modal.confirm({
                    nzClosable: false,
                    nzTitle: 'Logout Notice',
                    nzContent: `<p>${result.message}</p>`,
                    nzOnOk: () => {
                        this.store.dispatch(logoutAction());
                    },
                    nzCancelText: null,
                });
            });

        this.socket
            .fromEvent('refresh')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.modal.confirm({
                    nzClosable: false,
                    nzTitle: 'The website requires a refresh',
                    nzContent: `<p>${result.message}</p>`,
                    nzOnOk: () => {
                        window.location.reload();
                    },
                    nzCancelText: null,
                });
            });

        this.socket
            .fromEvent('missing-translations')
            .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.notification.template(this.missingTranslationTemplate, { nzData: JSON.stringify(result, null, 2) });
            });

        this.socket
            .fromEvent('verification')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.notification
                    .info('Verify Infringement', result.message)
                    .onClick.asObservable()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        if (result?.data?.uuid) {
                            this.router.navigate(['/home', 'logs', 'job', result.data.uuid]);
                        } else {
                            this.router.navigate(['/home', 'logs', 'job']);
                        }
                    });
            });

        this.socket
            .fromEvent('verification-success')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.notification
                    .success('Verify Infringement', result.message)
                    .onClick.asObservable()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        if (result?.data?.infringement) {
                            const infringement = plainToClass(Infringement, result?.data?.infringement);
                            this.infringementStore.dispatch(infringementNgrxHelper.upsertOne({ item: infringement }));
                            this.router.navigate(['/home', 'infringements', 'view', infringement.infringementId]);
                        } else {
                            this.router.navigate(['/home', 'infringements', 'view']);
                        }
                    });
            });

        this.socket
            .fromEvent('verification-start')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.notification.info('Verify Infringement', result.message);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
