import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { userNgrxHelper, UserState } from '@modules/user/ngrx/user.reducer';
import { select, Store } from '@ngrx/store';
import { User } from '@modules/shared/models/entities/user.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { UserService } from '@modules/user/services/user.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-view-user',
    templateUrl: './view-user.component.html',
    styleUrls: ['./view-user.component.less'],
})
export class ViewUserComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() userId: number;
    user: User;

    updateUserState: ElementStateModel<User> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<User>> = new EventEmitter();

    private destroy$ = new Subject();

    constructor(
        private store: Store<UserState>,
        private logger: NGXLogger,
        private userService: UserService,
        private message: NzMessageService,
    ) {}

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.store
            .pipe(
                select(userNgrxHelper.selectEntityById(this.userId)),
                takeUntil(this.destroy$),
                tap((user) => {
                    if (!user) {
                        this.logger.debug('User not found on store, querying for it');
                        this.userService.getUser(this.userId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.user = result;
            });
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<User>) {
        this.onUpdate();
        this.updateUserState = state;
    }

    onDelete(deleteState: ElementStateModel<User>) {
        this.destroy$.next();
        if (deleteState.hasSucceeded()) {
            this.delete.emit(deleteState);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
