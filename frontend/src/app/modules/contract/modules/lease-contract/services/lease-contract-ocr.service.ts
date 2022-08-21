import { Injectable } from '@angular/core';
import { Document } from '@modules/shared/models/entities/document.model';
import * as moment from 'moment';
import i18next from 'i18next';
import { OcrDto } from '@modules/contract/modules/lease-contract/services/ocr.dto';
import { Contract } from '@modules/shared/models/entities/contract.model';

@Injectable({
    providedIn: 'root',
})
export class LeaseContractOcrService {
    constructor() {}
    private contract: OcrDto;
    private document: OcrDto;

    documentToOcr(document: Document): OcrDto {
        const dto: OcrDto = {
            startDate: document.ocr.start,
            endDate: document.ocr.end,
            user: document.ocr.customer,
            owner: document.ocr.owner,
            vehicle: document.ocr.car,
        };
        return dto;
    }

    contractToOcr(contract: Contract): OcrDto {
        const dto: OcrDto = {
            startDate: contract.startDate,
            endDate: contract.endDate,
            user: contract.user.identifier,
            owner: contract.owner.identifier,
            vehicle: contract.vehicle.registration,
        };
        return dto;
    }

    performOcrOnContractAndDocument(contract: Contract, document: Document) {
        const contractOcr = this.contractToOcr(contract);
        const documentOcr = this.documentToOcr(document);
        return this.performOcr(contractOcr, documentOcr);
    }

    performOcr(contract: OcrDto, document: OcrDto): string[] {
        this.document = document;
        this.contract = contract;
        if (
            !this.contract ||
            +this.contract.owner !== +this.document.owner ||
            +this.contract.user !== +this.document.user ||
            +this.contract.vehicle !== +this.document.vehicle ||
            !moment(this.contract.startDate).startOf('day').isSame(moment(this.document.startDate).startOf('day')) ||
            !moment(this.contract.endDate).startOf('day').isSame(moment(this.document.endDate).startOf('day'))
        ) {
            return this.generateErrorMessages();
        }
        return;
    }

    private generateErrorMessages(): string[] {
        const ocrErrorMessage: string[] = [''];
        if (!this.contract) {
            ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_not_found'));
        }
        if (+this.contract.owner !== +this.document.owner) {
            ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_owner_identifier_not_match'));
        }
        if (+this.contract.user !== +this.document.user) {
            ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_user_identifier_not_match'));
        }
        if (+this.contract.vehicle !== +this.document.vehicle) {
            ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_vehicle_registration_not_match'));
        }
        if (!moment(this.contract.startDate).startOf('day').isSame(moment(this.document.startDate).startOf('day'))) {
            ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_start_date_not_match'));
        }
        if (!moment(this.contract.endDate).startOf('day').isSame(moment(this.document.endDate).startOf('day'))) {
            ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_end_date_not_match'));
        }
        return ocrErrorMessage;
    }
}
