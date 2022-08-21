import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-infringement',
    templateUrl: './delete-infringement.component.html',
    styleUrls: ['./delete-infringement.component.less'],
})
export class DeleteInfringementComponent implements OnInit {
    @Input() infringementId: number;

    deleteInfringementState: ElementStateModel<Infringement> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Infringement>> = new EventEmitter();

    permissions = PERMISSIONS;

    constructor(private infringementService: InfringementService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteInfringementState.submit();
        this.infringementService.deleteInfringement(this.infringementId).subscribe(
            (infringement) => {
                this.deleteInfringementState.onSuccess(i18next.t('delete-infringement.success'), infringement);
                this.message.success(this.deleteInfringementState.successResult().message);
                this.delete.emit(this.deleteInfringementState);
            },
            (error) => {
                this.deleteInfringementState.onFailure(i18next.t('delete-infringement.fail'), error);
                this.message.error(this.deleteInfringementState.failedResult().message);
            },
        );
    }
}
