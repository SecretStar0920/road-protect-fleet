import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Document, Infringement, InfringementStatus, ManualPayment, Payment } from '@entities';
import { getManager } from 'typeorm';
import { CreateManualPaymentDto } from '@modules/payment/modules/manual-payment/controllers/manual-payment.controller';
import { isNil } from 'lodash';
import { UploadManualProofOfPaymentDto } from '@modules/payment/controllers/payment-spreadsheet.controller';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class CreateManualPaymentService {
    constructor(private logger: Logger, private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService) {}

    async create(dto: CreateManualPaymentDto): Promise<ManualPayment> {
        this.logger.debug({ message: 'Creating Manual Payment', detail: dto, fn: this.create.name });
        const created = await this.createOnly(dto);
        const manualPayment = await getManager().transaction(async (transaction) => {
            const saved = await transaction.save(created);
            return saved;
        });
        this.logger.debug({ message: 'Saved Manual Payment', detail: manualPayment, fn: this.create.name });
        return manualPayment;
    }

    async createOnly(dto: CreateManualPaymentDto): Promise<ManualPayment> {
        const [infringement, document] = await this.checkRelations(dto.infringementId, dto.documentId);

        // Check if there is a previous successful infringement and remove it before making a new one
        const lastSuccessfulPayment = await Payment.findWithMinimalRelations()
            .leftJoinAndSelect('payment.successfulInfringement', 'successful')
            .andWhere('successful.infringementId = :id', { id: infringement.infringementId })
            .getOne();
        if (!!lastSuccessfulPayment) {
            lastSuccessfulPayment.successfulInfringement = null;
            await lastSuccessfulPayment.save();
        }

        const manualPayment = ManualPayment.create({
            ...dto,
            infringement,
            successfulInfringement: infringement,
            document,
        });

        // Update total payments
        await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(manualPayment.infringement.infringementId);

        return manualPayment;
    }

    /**
     * Quite different interface for upload
     */
    async createByUpload(dto: UploadManualProofOfPaymentDto, document?: Document): Promise<ManualPayment> {
        this.logger.debug({ message: 'Creating Manual Payment', detail: dto, fn: this.create.name });
        const [infringement] = await this.checkUploadRelations(dto.noticeNumber, dto.issuer);

        // Check if there is a previous successful infringement and remove it before making a new one
        const lastSuccessfulPayment = await Payment.findWithMinimalRelations()
            .leftJoinAndSelect('payment.successfulInfringement', 'successful')
            .andWhere('successful.infringementId = :id', { id: infringement.infringementId })
            .getOne();
        if (!!lastSuccessfulPayment) {
            lastSuccessfulPayment.successfulInfringement = null;
            await lastSuccessfulPayment.save();
        }

        const created = ManualPayment.create({
            ...dto,
            infringement,
            successfulInfringement: infringement,
            document: document ?? null
        });

        created.details = {
            additional: 'Paid by Road Protect',
        };

        // Update total payments
        await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(created.infringement.infringementId);

        const manualPayment = await getManager().transaction(async (transaction) => {
            // Update infringement and nomination statuses
            // TODO: share code here with where infringements are actually manually paid to ensure
            // it works the same
            infringement.status = InfringementStatus.Paid;
            await transaction.save(infringement);

            if (infringement.nomination) {
                infringement.nomination.status = NominationStatus.Closed;
                await transaction.save(infringement.nomination);
            }

            const saved = await transaction.save(created);

            return saved;
        });
        this.logger.debug({ message: 'Saved Manual Payment', detail: manualPayment, fn: this.create.name });
        return manualPayment;
    }

    private async checkUploadRelations(noticeNumber: string, issuer: string): Promise<[Infringement]> {
        const infringement = await Infringement.findByNoticeNumberAndIssuer(noticeNumber, issuer).getOne();

        if (isNil(infringement)) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message() });
        }

        return [infringement];
    }

    private async checkRelations(infringementId: number, documentId: number): Promise<[Infringement, Document]> {
        let document: Document;
        if (documentId) {
            document = await Document.createQueryBuilder('document').where('document.documentId = :id', { id: documentId }).getOne();
            if (isNil(document)) {
                throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message() });
            }
        }
        const infringement = await Infringement.findWithMinimalRelations()
            .where('infringement.infringementId = :id', { id: infringementId })
            .getOne();

        if (isNil(infringement)) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message() });
        }

        return [infringement, document];
    }
}
