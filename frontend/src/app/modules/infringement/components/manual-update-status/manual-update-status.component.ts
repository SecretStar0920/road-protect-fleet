import { Component, Input, OnInit } from '@angular/core';
import i18next from 'i18next';
import {
    INominationStatusQuestions,
    NominationStatusQuestionIds,
    nominationStatusQuestionsObject,
} from '@modules/infringement/components/manual-update-status/nomination-status-questions';
import { NominationStatus } from '@modules/shared/models/entities/nomination.model';
import { get } from 'lodash';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Infringement, InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { UpsertInfringementDto } from '@modules/infringement/services/upsert-infringement.dto';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import * as moment from 'moment';

interface ISelectedInformation {
    nominationStatus: NominationStatus;
    nominationForm: FormGroup;
    infringementStatus: InfringementStatus;
}

@Component({
    selector: 'rp-update-statuses-modal',
    templateUrl: './manual-update-status.component.html',
    styleUrls: ['./manual-update-status.component.less'],
})
export class ManualUpdateStatusComponent implements OnInit {
    @Input() infringement: Infringement;
    stepper: Stepper<ISelectedInformation>;
    questions: INominationStatusQuestions = nominationStatusQuestionsObject;
    questionIds: string[];
    currentSelection: NominationStatusQuestionIds;
    nominationStatuses = NominationStatus;
    selectedInformation: ISelectedInformation = { nominationStatus: null, nominationForm: null, infringementStatus: null };
    infringementOptions: InfringementStatus[];
    updateInfringementStatusState: ElementStateModel<Infringement> = new ElementStateModel();
    updatedInfringement: boolean = false;
    errorMessage: string;
    advanced: boolean = false;

    constructor(private fb: FormBuilder, private infringementService: InfringementService) {
        this.selectedInformation.nominationForm = this.fb.group({
            //    For In Redirection
            inRedirection: new FormGroup({
                redirectionIdentifier: new FormControl(null, []),
                redirectionLetterSendDate: new FormControl(null, Validators.required),
            }),
            //    For RedirectionComplete
            redirectionComplete: new FormGroup({
                redirectionIdentifier: new FormControl(null, []),
                redirectionLetterSendDate: new FormControl(null, []),
                dateRedirectionCompleted: new FormControl(null, Validators.required),
            }),
        });
        this.stepper = new Stepper<ISelectedInformation>([
            new Step({
                title: i18next.t('edit-status.nomination_status'),
                validatorFunction: (data) => this.validStep1(data),
            }),
            new Step({ title: i18next.t('edit-status.infringement_status'), validatorFunction: (data) => !!data.infringementStatus }),
            new Step({ title: i18next.t('edit-status.submit') }),
        ]);
    }

    ngOnInit(): void {
        this.initialise();
    }

    initialise() {
        this.resetNominationStatusSelection();
        this.questionIds = Object.keys(this.questions);
        this.stepper.data = this.selectedInformation;
    }

    resetNominationStatusSelection() {
        this.currentSelection = NominationStatusQuestionIds.isInRedirection;
        this.selectedInformation.nominationStatus = null;
        this.selectedInformation.infringementStatus = null;
        this.selectedInformation.nominationForm.reset();
        this.updateInfringementStatusState.reset();
        this.infringementOptions = [];
        this.updatedInfringement = false;
    }

    validStep1(data: ISelectedInformation): boolean {
        if (!data.nominationStatus) {
            return false;
        } else if (data.nominationStatus === NominationStatus.RedirectionCompleted) {
            return data.nominationForm.controls.redirectionComplete.valid;
        } else if (data.nominationStatus === NominationStatus.InRedirectionProcess) {
            return data.nominationForm.controls.inRedirection.valid;
        } else {
            return true;
        }
    }

    selectOption(selectedId: NominationStatusQuestionIds) {
        this.currentSelection = selectedId;
        const selectedNominationStatus = get(this.questions, [selectedId, 'selectedNominationStatus'], false);
        if (!!selectedNominationStatus) {
            this.selectedInformation.nominationStatus = selectedNominationStatus;
            if (selectedNominationStatus === NominationStatus.Closed) {
                this.infringementOptions = [InfringementStatus.Closed, InfringementStatus.Paid];
            } else {
                this.infringementOptions = [InfringementStatus.Outstanding, InfringementStatus.Due];
            }
        }
    }

    selectInfringementStatus(selected: InfringementStatus) {
        this.selectedInformation.infringementStatus = selected;
    }

    submitChanges() {
        this.updateInfringementStatusState.submit();
        let extraFields = {};
        if (this.selectedInformation.nominationStatus === NominationStatus.InRedirectionProcess) {
            extraFields = this.selectedInformation.nominationForm.value.inRedirection;
        } else if (this.selectedInformation.nominationStatus === NominationStatus.RedirectionCompleted) {
            extraFields = this.selectedInformation.nominationForm.value.redirectionComplete;
        } else if (
            this.selectedInformation.nominationStatus === NominationStatus.Acknowledged &&
            this.infringement.nomination?.status === NominationStatus.RedirectionCompleted
        ) {
            this.selectedInformation.nominationStatus = NominationStatus.Pending;
        }

        const updateInfringementStatusDto: UpsertInfringementDto = {
            issuer: this.infringement.issuer.name,
            nominationStatus: this.selectedInformation.nominationStatus,
            infringementStatus: this.selectedInformation.infringementStatus,
            noticeNumber: this.infringement.noticeNumber,
            ...extraFields,
        };
        this.infringementService.updateInfringementStatus(updateInfringementStatusDto).subscribe(
            (result) => {
                this.updateInfringementStatusState.onSuccess(i18next.t('update-infringement.success'), result);
                if (get(result, 'nomination.status', false) === this.selectedInformation.nominationStatus) {
                    this.updatedInfringement = true;
                }
            },
            (error) => {
                this.updatedInfringement = false;
                this.updateInfringementStatusState.onFailure(i18next.t('update-infringement.fail'), error.error);
                this.errorMessage = error.error?.message;
            },
        );
    }

    toggleAdvanced() {
        this.advanced = !this.advanced;
        this.resetNominationStatusSelection();
    }

    selectPaid() {
        this.selectedInformation.infringementStatus = InfringementStatus.Paid;
        this.selectedInformation.nominationStatus = NominationStatus.Closed;
    }

    selectRedirectionComplete() {
        this.selectedInformation.infringementStatus = this.infringement.status;
        this.selectedInformation.nominationStatus = NominationStatus.RedirectionCompleted;
        this.selectedInformation.nominationForm.get('redirectionComplete.dateRedirectionCompleted').setValue(moment().toDate());
    }

    canSelectPaid() {
        return this.infringement.nomination?.status !== NominationStatus.Closed;
    }

    canSelectRedirectionComplete() {
        const validStatuses = [NominationStatus.InRedirectionProcess, NominationStatus.Acknowledged, NominationStatus.RedirectionCompleted];
        return validStatuses.includes(this.infringement.nomination?.status);
    }

    canSubmit() {
        return (
            !!this.selectedInformation.nominationStatus &&
            !!this.selectedInformation.infringementStatus &&
            !this.updateInfringementStatusState.hasCompleted()
        );
    }
}
