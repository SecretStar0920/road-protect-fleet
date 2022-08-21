import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, Nomination } from '@entities';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { difference, forEach, groupBy, includes, isNil, uniqBy } from 'lodash';
import { CreditGuardIntegrationType } from '@integrations/credit-guard/credit-guard.integration';
import { BigNumber } from 'bignumber.js';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { Config } from '@config/config';
import * as moment from 'moment';

export enum PaymentFlow {
    None = 'None',
    RpTwoPhase = 'RpTwoPhase',
    AtgDirect = 'AtgDirect',
}

export interface IPaymentFlowDetail {
    description: string;
    id: PaymentFlow;
    requiredPaymentMethods: CreditGuardIntegrationType[];
}

export const PAYMENT_FLOW_DETAILS: { [key: string]: IPaymentFlowDetail } = {
    [PaymentFlow.None]: { description: 'No supported payment integration', id: PaymentFlow.None, requiredPaymentMethods: [] },
    [PaymentFlow.RpTwoPhase]: {
        description: 'Road Protect Payment Portal',
        id: PaymentFlow.RpTwoPhase,
        requiredPaymentMethods: [CreditGuardIntegrationType.RP],
    },
    [PaymentFlow.AtgDirect]: {
        description: 'Direct Automation Payment Portal',
        id: PaymentFlow.AtgDirect,
        requiredPaymentMethods: [CreditGuardIntegrationType.ATG],
    },
};

export class PayInfringementDetails {
    canBePaid: boolean;
    message?: string;
    // Base details
    infringementId: number;
    nominationId: number;
    amountDue: string;
    // Issuer based
    isATG: boolean;
    isPCI: boolean;
    paymentFlow: IPaymentFlowDetail;
    additional?: any;
    // Account based
    hasAllRequiredPaymentMethods: boolean;
    missingPaymentMethods: string[] = [];
    requiredPaymentMethods: string[] = [];
    hasPaymentMethods: { method: string; cardMask: string }[] = [];
    paymentMethodsToBeUsed: { method: string; cardMask: string }[] = [];
}

export class BatchPayInfringementDetails {
    payable: { [message: string]: PayInfringementDetails[] };
    payableIds: number[];
    amountPayable: string;
    notPayable: { [message: string]: PayInfringementDetails[] };
    notPayableIds: number[];
    amountNotPayable: string;
    paymentMethodsToBeUsed: { method: string; cardMask: string }[] = [];
}

@Injectable()
export class GetMunicipalPaymentDetailsService {
    constructor(private logger: Logger, private atgIssuers: AtgIssuers) {}

    /**
     * Used to check whether the infringement is linked to a municipality that we have integrations with
     */
    @Transactional()
    async getPaymentDetails(nominationId: number, accountId: number): Promise<PayInfringementDetails> {
        this.logger.debug({
            message: 'Checking if infringement/nomination can be paid',
            detail: { nominationId, accountId },
            fn: this.getPaymentDetails.name,
        });

        // 1. Setup details object
        const details = new PayInfringementDetails();

        // 2. Find nomination
        const nomination = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId = :nominationId', { nominationId })
            .getOne();
        if (isNil(nomination)) {
            details.canBePaid = false;
            details.message = 'ERROR: Cannot find nomination';
            return details;
        }
        details.nominationId = nominationId;

        // Base details
        const infringement = nomination.infringement;
        details.infringementId = infringement.infringementId;
        details.amountDue = infringement.amountDue;

        // 3. Check issuer information
        const issuer = nomination.infringement.issuer;
        details.isATG = await this.atgIssuers.isATGIssuer(issuer.issuerId);
        details.isPCI = await this.atgIssuers.isPCICompliant(issuer.issuerId);

        // 3.1 Check requesting account is the nominated account
        // NB this is likely going to change as customers should be able to pay even if they are not nominated
        const nominatedAccount = nomination.account;
        const requestingAccount = await Account.findWithMinimalRelationsAndTokens()
            .where('account.accountId = :accountId', { accountId })
            .getOne();

        if (isNil(nominatedAccount) || isNil(requestingAccount)) {
            throw new BadRequestException({ message: ERROR_CODES.E101_AccountDetailsMissing.message() });
        }
        if (requestingAccount.accountId !== nominatedAccount.accountId) {
            this.logger.warn({
                message:
                    'Requesting account not the nominated account on this infringement. Payment will come from the representing account',
                detail: { nominatedAccount, requestingAccount },
                fn: this.getPaymentDetails.name,
            });
        }

        // 4. Decide on a payment flow, which determins what is required
        if (details.isATG && details.isPCI) {
            details.paymentFlow = PAYMENT_FLOW_DETAILS[PaymentFlow.AtgDirect];
            if (moment(infringement.externalChangeDate).isBefore(moment().subtract(Config.get.payment.paymentVerificationHours, 'hours'))) {
                details.canBePaid = false;
                details.message = `The infringement has not been verified in the last ${Config.get.payment.paymentVerificationHours} hours. Verify the infringement and try again.`;
                return details;
            }
        } else if (details.isATG && !details.isPCI) {
            details.paymentFlow = PAYMENT_FLOW_DETAILS[PaymentFlow.RpTwoPhase];
            details.canBePaid = false;
            details.message = `Insecure payments have been disabled for: ${issuer.name}`;
            return details;
        } else {
            details.paymentFlow = PAYMENT_FLOW_DETAILS[PaymentFlow.None];
            details.canBePaid = false;
            details.message = `Payment not supported to this municipality: ${issuer.name}`;
            return details;
        }

        // 4. Check which payment methods are available on the account and if they meet the flow criteria
        details.requiredPaymentMethods = details.paymentFlow.requiredPaymentMethods;
        details.hasPaymentMethods = [];
        if (!isNil(requestingAccount.rpCreditGuard)) {
            const cardDetail = { method: CreditGuardIntegrationType.RP, cardMask: requestingAccount.rpCreditGuard.cardMask };
            details.hasPaymentMethods.push(cardDetail);
            if (includes(details.requiredPaymentMethods, cardDetail.method)) {
                details.paymentMethodsToBeUsed.push(cardDetail);
            }
        }
        if (!isNil(requestingAccount.atgCreditGuard)) {
            const cardDetail = { method: CreditGuardIntegrationType.ATG, cardMask: requestingAccount.atgCreditGuard.cardMask };
            details.hasPaymentMethods.push({ method: CreditGuardIntegrationType.ATG, cardMask: requestingAccount.atgCreditGuard.cardMask });
            if (includes(details.requiredPaymentMethods, cardDetail.method)) {
                details.paymentMethodsToBeUsed.push(cardDetail);
            }
        }
        details.missingPaymentMethods = difference(
            details.requiredPaymentMethods,
            details.hasPaymentMethods.map((i) => i.method),
        );
        details.hasAllRequiredPaymentMethods =
            difference(
                details.requiredPaymentMethods,
                details.hasPaymentMethods.map((i) => i.method),
            ).length === 0;

        if (!details.hasAllRequiredPaymentMethods) {
            details.canBePaid = false;
            details.message =
                'Missing required payment method(s): ' +
                details.missingPaymentMethods.join(', ') +
                '\n' +
                'Please add the payment method on your account profile';
            return details;
        }

        details.canBePaid = true;
        details.message = 'Ready for payment';

        return details;
    }

    @Transactional()
    async getPaymentDetailsBatchGrouped(nominationIds: number[], accountId: number): Promise<BatchPayInfringementDetails> {
        const details: PayInfringementDetails[] = [];
        for (const nominationId of nominationIds) {
            details.push(await this.getPaymentDetails(nominationId, accountId));
        }

        const batchDetails: BatchPayInfringementDetails = new BatchPayInfringementDetails();

        // Group by whether they can be paid or not
        const groupedDetails: any = {
            ...{ payable: [], notPayable: [] },
            ...groupBy(details, (val) => (val.canBePaid ? 'payable' : 'notPayable')),
        };

        const paymentMethodsToBeUsed = [];
        (groupedDetails.payable as PayInfringementDetails[]).forEach((payable: PayInfringementDetails) => {
            paymentMethodsToBeUsed.push(...payable.paymentMethodsToBeUsed);
        });
        batchDetails.paymentMethodsToBeUsed = uniqBy(paymentMethodsToBeUsed, (i) => i.method);
        // Calculate some summary fields
        batchDetails.payableIds = groupedDetails.payable.map((detail) => detail.nominationId);
        batchDetails.notPayableIds = groupedDetails.notPayable.map((detail) => detail.nominationId);
        batchDetails.amountPayable = groupedDetails.payable.reduce((total, detail) => {
            return new BigNumber(total).plus(detail.amountDue).toFixed(2);
        }, '0.00');
        batchDetails.amountNotPayable = groupedDetails.notPayable.reduce((total, detail) => {
            return new BigNumber(total).plus(detail.amountDue).toFixed(2);
        }, '0.00');

        // Group the details by their failure message too.
        forEach(groupedDetails, (val, key) => {
            groupedDetails[key] = groupBy(val, (subVal) => subVal.message);
        });

        batchDetails.payable = groupedDetails.payable;
        batchDetails.notPayable = groupedDetails.notPayable;

        return batchDetails;
    }
}
