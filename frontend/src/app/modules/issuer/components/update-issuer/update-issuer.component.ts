import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { IssuerService } from '@modules/issuer/services/issuer.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';
import { UserType } from '@modules/shared/models/entities/user.model';

@Component({
    selector: 'rp-update-issuer',
    templateUrl: './update-issuer.component.html',
    styleUrls: ['./update-issuer.component.less'],
})
export class UpdateIssuerComponent implements OnInit {
    @Input() issuer: Issuer;
    userTypes = UserType;
    updateIssuerForm: FormGroup;
    updateIssuerState: ElementStateModel<Issuer> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Issuer>> = new EventEmitter();

    get f() {
        return this.updateIssuerForm.controls;
    }

    constructor(private issuerService: IssuerService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateIssuerForm = this.fb.group({
            name: new FormControl(this.issuer.name),
            address: new FormControl(this.issuer.address),
            email: new FormControl(this.issuer.email, [Validators.email]),
            fax: new FormControl(this.issuer.fax),
            telephone: new FormControl(this.issuer.telephone),
            contactPerson: new FormControl(this.issuer.contactPerson),
            redirectionEmail: new FormControl(this.issuer.redirectionEmail),
            externalPaymentLink: new FormControl(this.issuer.externalPaymentLink),
            provider: new FormControl(this.issuer.integrationDetails.type),
            code: new FormControl(this.issuer.code),
            externalCode: new FormControl(this.issuer.integrationDetails.code),
            latestInfoDate: new FormControl(this.issuer.latestInfoDate ? this.issuer.latestInfoDate.toDate() : null),
            integrationDetails: new FormControl(JSON.stringify(this.issuer.integrationDetails)),
        });
    }

    onUpdateIssuer() {
        this.updateIssuerState.submit();
        this.issuerService.updateIssuer(this.issuer.issuerId, this.updateIssuerForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully updated Issuer', result);
                this.updateIssuerState.onSuccess(i18next.t('update-issuer.success'), result);
                this.complete.emit(this.updateIssuerState);
            },
            (error) => {
                this.logger.error('Failed to update Issuer', error);
                this.updateIssuerState.onFailure(i18next.t('update-issuer.fail'), error.error);
                this.complete.emit(this.updateIssuerState);
            },
        );
    }
}
