import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';
import { UserService } from '@modules/user/services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-user',
    templateUrl: './delete-user.component.html',
    styleUrls: ['./delete-user.component.less'],
})
export class DeleteUserComponent implements OnInit {
    @Input() userId: number;

    deleteUserState: ElementStateModel<User> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<User>> = new EventEmitter();

    constructor(private userService: UserService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteUserState.submit();
        this.delete.emit(this.deleteUserState);
        this.userService.deleteUser(this.userId).subscribe(
            (user) => {
                this.deleteUserState.onSuccess(i18next.t('delete-user.success'), user);
                this.message.success(this.deleteUserState.successResult().message);
                this.delete.emit(this.deleteUserState);
            },
            (error) => {
                this.deleteUserState.onFailure(i18next.t('delete-user.fail'), error);
                this.message.error(this.deleteUserState.failedResult().message);
            },
        );
    }
}
