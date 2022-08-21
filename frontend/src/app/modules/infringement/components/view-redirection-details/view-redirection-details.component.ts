import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { NominationStatus, RedirectionType } from '@modules/shared/models/entities/nomination.model';
import { MunicipalRedirectionDetails } from '@modules/infringement/components/check-nomination-redirection-details/municipal-redirection.details';
import { isNil } from 'lodash';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-redirection-details',
    templateUrl: './view-redirection-details.component.html',
    styleUrls: ['./view-redirection-details.component.less'],
})
export class ViewRedirectionDetailsComponent implements OnInit {
    validNominationStatuses: NominationStatus[] = [
        NominationStatus.Pending,
        NominationStatus.Acknowledged,
        NominationStatus.RedirectionCompleted,
    ];
    validInfringementStatuses: InfringementStatus[] = [InfringementStatus.Due, InfringementStatus.Outstanding];
    private _infringementId: number;

    get infringementId(): number {
        return this._infringementId;
    }

    @Input()
    set infringementId(value: number) {
        if (!isNil(value) && value !== this._infringementId) {
            this._infringementId = value;
            this.onCheck();
        }
    }

    details: MunicipalRedirectionDetails;
    signatureUrl: SafeUrl;
    redirectionTypes = RedirectionType;

    getDetailsState: ElementStateModel = new ElementStateModel();

    @Output() redirectionDetails: EventEmitter<MunicipalRedirectionDetails> = new EventEmitter();

    constructor(private infringementService: InfringementService, private sanitizer: DomSanitizer) {}

    ngOnInit() {}

    generateSubtitle(): string {
        if (this.details.redirectionChannel) {
            return i18next.t('infringement-redirection-details.type_' + this.details.type + '_' + this.details.redirectionChannel);
        }
        return i18next.t('infringement-redirection-details.type_' + this.details.type);
    }

    onCheck() {
        this.getDetailsState.submit();
        this.infringementService.getRedirectionDetails(this._infringementId).subscribe(
            (result) => {
                this.getDetailsState.onSuccess();
                this.details = result;
                this.redirectionDetails.emit(this.details);

                this.signatureUrl = this.sanitizer.bypassSecurityTrustUrl(this.details.hasSignatureAvailable.details.signatureSvg);
            },
            (error) => {
                this.getDetailsState.onFailure();
            },
        );
    }
}
