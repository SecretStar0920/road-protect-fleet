import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { User } from '@modules/shared/models/entities/user.model';
import { Store } from '@ngrx/store';
import { currentUser } from '@modules/auth/ngrx/auth.reducer';
import { AppState } from '../../../../ngrx/app.reducer';

@Component({
    selector: 'rp-users-page',
    templateUrl: './users-page.component.html',
    styleUrls: ['./users-page.component.less'],
})
export class UsersPageComponent implements OnInit {
    viewUserModal: NzModalRef<any>;
    currentUser: User;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router, private store: Store<AppState>) {}

    ngOnInit() {
        this.store.select(currentUser).subscribe((user) => {
            this.currentUser = user;
        });
    }

    onViewUser(userId: number) {
        if (!userId) {
            this.logger.warn('Tried to view an user without an user id');
            return;
        }
        this.router.navigate(['/home', 'users', 'view', userId]);
    }
}
