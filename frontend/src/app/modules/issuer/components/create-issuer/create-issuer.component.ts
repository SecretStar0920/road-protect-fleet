import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IssuerService } from '@modules/issuer/services/issuer.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Issuer, IssuerType } from '@modules/shared/models/entities/issuer.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-create-issuer',
    templateUrl: './create-issuer.component.html',
    styleUrls: ['./create-issuer.component.less'],
})
export class CreateIssuerComponent implements OnInit {
    createIssuerForm: FormGroup;
    createIssuerState: ElementStateModel<Issuer> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    issuerTypes = Object.values(IssuerType);

    get f() {
        return this.createIssuerForm.controls;
    }

    constructor(private issuerService: IssuerService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createIssuerForm = this.fb.group({
            name: new FormControl(null, Validators.required),
            code: new FormControl(null, Validators.required),
            type: new FormControl(IssuerType.Municipal, Validators.required),
            address: new FormControl(null),
            email: new FormControl(null, [Validators.email]),
            fax: new FormControl(null),
            telephone: new FormControl(null),
            contactPerson: new FormControl(null),
            redirectionEmail: new FormControl(null),
            externalPaymentLink: new FormControl(null),
            provider: new FormControl(null),
            authority: new FormControl(null),
        });
    }

    onCreateIssuer() {
        this.createIssuerState.submit();
        this.issuerService.createIssuer(this.createIssuerForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully created Issuer', result);
                this.createIssuerState.onSuccess(i18next.t('create-issuer.success'), result);
                this.complete.emit(this.createIssuerState);
            },
            (error) => {
                this.logger.error('Failed to create Issuer', error);
                this.createIssuerState.onFailure(i18next.t('create-issuer.fail'), error.error);
                this.complete.emit(this.createIssuerState);
            },
        );
    }
}
