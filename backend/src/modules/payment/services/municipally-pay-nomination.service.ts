import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@logger';
import {
    Account,
    Infringement,
    InfringementLog,
    InfringementStatus,
    IntegrationPayment,
    IntegrationPaymentStatus,
    Log,
    LogPriority,
    LogType,
    Nomination,
    Payment,
} from '@entities';
import { isNil, some } from 'lodash';
import {
    GetMunicipalPaymentDetailsService,
    PayInfringementDetails,
    PAYMENT_FLOW_DETAILS,
} from '@modules/payment/services/get-municipal-payment-details.service';
import { AutomationPaymentIntegration } from '@integrations/automation/payment/payment.automation-integration';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { RpCreditGuardIntegration } from '@integrations/credit-guard/rp-credit-guard.integration';
import { BigNumber } from 'bignumber.js';
import { FailedPaymentEmailService } from '@modules/shared/modules/email/services/failed-payment-email.service';
import { PaymentCvvDetails } from '@modules/payment/dtos/batch-municipal-pay-nominations.dto';
import { CreditGuardIntegrationType } from '@integrations/credit-guard/credit-guard.integration';
import { extractAtgPaymentReference } from '@modules/payment/helpers/atg-payment-reference-extractor';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';
import { Config } from '@config/config';

@Injectable()
export class MunicipallyPayNominationService {
    constructor(
        private logger: Logger,
        private municipalPaymentService: GetMunicipalPaymentDetailsService,
        private failedPaymentEmailService: FailedPaymentEmailService,
        private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService,
    ) {}

    async municipallyPayNomination(nominationId: number, accountId: number, cvv: PaymentCvvDetails): Promise<Nomination> {
        this.logger.debug({
            message: 'Municipal Payment of Nomination: ',
            detail: { nominationId, accountId },
            fn: this.municipallyPayNomination.name,
        });

        // Check for nomination
        const nomination = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId = :nominationId', { nominationId })
            .getOne();
        if (isNil(nomination)) {
            throw new BadRequestException({ message: ERROR_CODES.E020_CouldNotFindNomination.message() });
        }

        // Check it's in a status we can pay
        if (some([NominationStatus.InRedirectionProcess, NominationStatus.Closed], nomination.status)) {
            throw new BadRequestException({
                message: ERROR_CODES.E108_WrongNominationStatusForPayment.message({ status: nomination.status }),
            });
        }

        // Find the infringement and account with relevant information
        const infringement = await Infringement.findByIdWithPaymentRelations(nomination.infringement.infringementId);

        // NOTE: the account requesting is the account which will pay
        const account: Account = await Account.findWithMinimalRelationsAndTokens()
            .where('account.accountId = :accountId', { accountId })
            .getOne();

        // Check payment details
        const paymentDetails: PayInfringementDetails = await this.municipalPaymentService.getPaymentDetails(nominationId, accountId);
        if (!paymentDetails.canBePaid) {
            throw new BadRequestException({ message: ERROR_CODES.E102_InfringementCannotBePaid.message(), detail: paymentDetails });
        }

        // Check if there is a previous successful infringement and remove it before making a new one
        const lastSuccessfulPayment = await Payment.findWithMinimalRelations()
            .leftJoinAndSelect('payment.successfulInfringement', 'successful')
            .andWhere('successful.infringementId = :id', { id: infringement.infringementId })
            .getOne();
        if (!!lastSuccessfulPayment) {
            lastSuccessfulPayment.successfulInfringement = null;
            await lastSuccessfulPayment.save();
        }

        // Prepare a pending payment
        const reference = v4();
        const payment = await IntegrationPayment.create({
            status: IntegrationPaymentStatus.Pending,
            provider: paymentDetails.paymentFlow.id,
            infringement,
            successfulInfringement: infringement,
            details: {
                reference,
                integration: paymentDetails.paymentFlow,
            } as any,
        }).save();
        this.logger.debug({ message: 'Prepared a pending payment: ', detail: payment, fn: this.municipallyPayNomination.name });

        // Setup integration classes
        const atgPaymentIntegration = new AutomationPaymentIntegration(this.logger);
        const rpCreditGuardIntegration = new RpCreditGuardIntegration();

        // Decide on payment flow
        if (paymentDetails.paymentFlow.id === PAYMENT_FLOW_DETAILS.AtgDirect.id) {
            this.logger.debug({
                message: 'Attempting payment via ATG PCI',
                detail: paymentDetails.paymentFlow,
                fn: this.municipallyPayNomination.name,
            });

            // Check for verification
            if (moment(infringement.externalChangeDate).isBefore(moment().subtract(Config.get.payment.paymentVerificationHours, 'hours'))) {
                payment.status = IntegrationPaymentStatus.Failed;
                await payment.save();
                throw new BadRequestException({
                    message: `The infringement has not been verified in the last ${Config.get.payment.paymentVerificationHours} hours. Verify the infringement and try again.`,
                });
            }

            // 1. Pay ATG directly using accounts atgPaymentMethod
            const { success, result } = await atgPaymentIntegration.pay(
                infringement,
                account,
                `${payment.paymentId}`,
                cvv[CreditGuardIntegrationType.ATG],
            );
            payment.details.result = { success, result };
            payment.externalReference = extractAtgPaymentReference(payment);

            if (!success) {
                payment.status = IntegrationPaymentStatus.Failed;
                await payment.save();

                // Update total payments
                await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(payment.infringement.infringementId);

                throw new InternalServerErrorException({
                    message: ERROR_CODES.E103_PaymentToMunicipalityFailed.message({ message: result.message }),
                });
            }

            this.logger.debug({
                message: 'Successful payment via ATG PCI',
                detail: { success, result },
                fn: this.municipallyPayNomination.name,
                encrypt: true,
            });

            // Update total payments
            await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(payment.infringement.infringementId);
        } else if (paymentDetails.paymentFlow.id === PAYMENT_FLOW_DETAILS.RpTwoPhase.id) {
            this.logger.debug({
                message: 'Attempting payment via RP Two Phase',
                detail: paymentDetails.paymentFlow,
                fn: this.municipallyPayNomination.name,
            });

            // 1. Verify first
            // At this point it is assumed that the infringement has been verified
            // Check for verification
            if (moment(infringement.externalChangeDate).isBefore(moment().subtract(Config.get.payment.paymentVerificationHours, 'hours'))) {
                payment.status = IntegrationPaymentStatus.Failed;
                await payment.save();
                throw new BadRequestException({
                    message: `The infringement has not been verified in the last ${Config.get.payment.paymentVerificationHours} hours. Verify the infringement and try again.`,
                });
            }

            // 2. Charge token
            const amount = new BigNumber(infringement.amountDue).times(100).toFixed(0); // It's in cents
            const chargeTokenResult = await rpCreditGuardIntegration.chargeToken(
                account.rpCreditGuard,
                amount,
                reference,
                cvv[CreditGuardIntegrationType.RP],
            );
            payment.details.phaseOneResult = chargeTokenResult; // NB store result
            if (!chargeTokenResult.success) {
                payment.status = IntegrationPaymentStatus.Failed;
                await payment.save();

                // Update total payments
                await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(payment.infringement.infringementId);

                throw new InternalServerErrorException({
                    message: ERROR_CODES.E105_PaymentFailedToOurAccount.message({
                        statusText: chargeTokenResult.result.responseJson.ashrait.response.doDeal.statusText,
                        extendedStatusText: chargeTokenResult.result.responseJson.ashrait.response.doDeal.extendedStatusText,
                    }),
                });
            }

            // 3. Forward funds
            const atgForwardResult = await atgPaymentIntegration.payWithRpCard(infringement, account, `${payment.paymentId}`);
            payment.details.phaseTwoResult = atgForwardResult; // NB store result
            if (!atgForwardResult.success) {
                payment.status = IntegrationPaymentStatus.Failed;
                await payment.save();

                // Update total payments
                infringement.totalPayments = await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(
                    payment.infringement.infringementId,
                );

                this.logger.error({
                    message: 'CRITICAL: Failed to transfer from our account to ATG but payment was successful to RP account',
                    fn: this.municipallyPayNomination.name,
                });
                await this.failedPaymentEmailService
                    .sendFailedPaymentEmail({
                        errorMessage: 'CRITICAL: Failed to transfer from our account to ATG but payment was successful to RP account',
                        infringementNoticeNumber: infringement.noticeNumber,
                        paymentId: `${payment.paymentId}`,
                        paymentDate: payment.createdAt,
                        userEmail: account.primaryContact,
                        userName: account.name,
                    })
                    .catch();
                throw new InternalServerErrorException({
                    message: ERROR_CODES.E106_PaymentFailedToMunicipality.message({ message: atgForwardResult.result.message }),
                });
            }

            this.logger.debug({
                message: 'Successful payment via RP Two Phase',
                detail: atgForwardResult,
                fn: this.municipallyPayNomination.name,
            });
        } else {
            throw new InternalServerErrorException({
                message: ERROR_CODES.E107_UnsupportedPaymentIntegration.message(),
                detail: paymentDetails,
            });
        }

        // Update payment
        payment.status = IntegrationPaymentStatus.Successful; // Assuming successful if it reaches this point
        payment.amountPaid = infringement.amountDue;
        await payment.save();
        infringement.payments.push(payment);

        // Update total payments
        infringement.totalPayments = await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(
            payment.infringement.infringementId,
        );

        // Link
        const infringementOriginalStatus = nomination.infringement.status;
        nomination.status = NominationStatus.Closed;
        nomination.paidDate = moment().toISOString();
        infringement.status = InfringementStatus.Paid;

        await infringement.save();
        await nomination.save();
        nomination.infringement = infringement;

        // Create logs
        await InfringementLog.createAndSave({
            oldStatus: infringementOriginalStatus,
            newStatus: InfringementStatus.Paid,
            data: nomination.infringement,
            infringement: nomination.infringement,
        });
        await Log.createAndSave({
            infringement: nomination.infringement,
            type: LogType.Updated,
            message: 'Infringement paid municipally',
            priority: LogPriority.High,
        });

        this.logger.debug({ message: 'Municipally Paid Nomination: ', detail: nominationId, fn: this.municipallyPayNomination.name });
        return nomination;
    }

    async batchMunicipalPayNomination(
        nominationIds: number[],
        accountId: number,
        cvv: PaymentCvvDetails,
        socket: DistributedWebsocket,
    ): Promise<{ successful: Nomination[]; failed: { error: any; nomination: Nomination }[] }> {
        const successful: Nomination[] = [];
        const failed: { error: any; nomination: Nomination }[] = [];
        for (const nominationId of nominationIds) {
            try {
                const nomination = await this.municipallyPayNomination(nominationId, accountId, cvv);
                successful.push(nomination);
                socket.emit('payment-successful', { nomination, count: successful.length });
            } catch (e) {
                failed.push({
                    error: e,
                    nomination: await Nomination.findWithMinimalRelations().whereInIds([nominationId]).getOne(),
                });
                this.logger.error({
                    message: 'Failed to pay a nomination via batch',
                    detail: e,
                    fn: this.batchMunicipalPayNomination.name,
                });
                socket.emit('payment-failed', { error: e, count: failed.length });
            }
        }

        this.logger.debug({
            message: 'Batch payment result counts',
            detail: { failed: failed.length, successful: successful.length },
            fn: this.batchMunicipalPayNomination.name,
        });

        return { successful, failed };
    }
}
