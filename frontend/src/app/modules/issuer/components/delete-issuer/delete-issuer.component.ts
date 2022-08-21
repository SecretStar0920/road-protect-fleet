import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { IssuerService } from '@modules/issuer/services/issuer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-issuer',
    templateUrl: './delete-issuer.component.html',
    styleUrls: ['./delete-issuer.component.less'],
})
export class DeleteIssuerComponent implements OnInit {
    @Input() issuerId: number;

    deleteIssuerState: ElementStateModel<Issuer> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Issuer>> = new EventEmitter();

    constructor(private issuerService: IssuerService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteIssuerState.submit();
        this.delete.emit(this.deleteIssuerState);
        this.issuerService.deleteIssuer(this.issuerId).subscribe(
            (issuer) => {
                this.deleteIssuerState.onSuccess(i18next.t('delete-issuer.success'), issuer);
                this.message.success(this.deleteIssuerState.successResult().message);
                this.delete.emit(this.deleteIssuerState);
            },
            (error) => {
                this.deleteIssuerState.onFailure(i18next.t('delete-issuer.fail'), error);
                this.message.error(this.deleteIssuerState.failedResult().message);
            },
        );
    }
}
