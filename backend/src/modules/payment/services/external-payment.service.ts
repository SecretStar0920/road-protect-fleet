import { Injectable } from '@nestjs/common';
import { Infringement, InfringementStatus, Log, LogPriority, LogType, Payment, PaymentType } from '@entities';
import { GetPaymentService } from '@modules/payment/services/get-payment.service';
import { ExternalPayment } from '@modules/shared/entities/external-payment.entity';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import { Logger } from '@logger';
import { cloneDeep, isEqual, isNil } from 'lodash';
import { TryingToOverridePaymentDetailsException } from '@modules/payment/exceptions/trying-to-override-payment-details.exception';
import { Config } from '@config/config';
import { BigNumber } from 'bignumber.js';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { getManager } from 'typeorm';
import { IsDefined, IsOptional } from 'class-validator';

export class CreateExternalPaymentDto {
    @IsDefined()
    infringement: Infringement;

    @IsOptional()
    paymentDate?: string;

    @IsOptional()
    externalReference?: string;

    @IsOptional()
    details?: any;

    @IsOptional()
    amountPaid?: string;

    @IsOptional()
    paymentId?: number;

    @IsOptional()
    type?: PaymentType;

    @IsOptional()
    isSecure?: boolean;
}

@Injectable()
export class ExternalPaymentService {
    constructor(
        private getPaymentService: GetPaymentService,
        private logger: Logger,
        private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService,
    ) {}

    /**
     * Runs the upsert command "safely" (ie. we don't throw an exception) and
     * if there is an error then it saves it to the infringement log.
     * @param infringement
     * @param nominationDto
     */
    async upsertUsingNomination(infringement: Infringement, nominationDto: NominationDto) {
        try {
            await this.upsertExternalPayment(
                infringement,
                omitNull({
                    paymentDate: nominationDto.paymentDate || null,
                    amountPaid: nominationDto.paymentAmount ? new BigNumber(nominationDto.paymentAmount).toFixed(2) : null,
                    externalReference: nominationDto.paymentReference || null,
                }),
            );
        } catch (e) {
            await Log.createAndSave({
                infringement,
                priority: LogPriority.High,
                message: `Failed to add payment details with error ${e.message}`,
                type: LogType.Error,
            });
        }
    }

    /**
     * Insert or update a payment for an infringement. It's important to know
     * that sending in different pieces of information around the payment would
     * cause different actions. If you do not know when a payment was made, DO
     * NOT send in a payment date. The logic goes as follows:
     *
     * {
     *     "paymentDate": "2021-01-01 08:00:00",
     *     "amountPaid": "500",
     *     ...
     * }
     *
     * Here, I will look for a specific payment that matches the payment date
     * and I will update all of the details. If the amount paid or the details
     * are completely different but the payment date is the same, then I'll
     * log an error because it means we're trying to overwrite data that we
     * probably shouldn't.
     *
     * {
     *     "paymentDate": null,
     *     "amountPaid": 500,
     *     ...
     * }
     *
     * If this happens, I'll look to see if there are ANY payments that match
     * that amount and if there are, I will not add this one. This is good for
     * adding payment information where it's just a status change (to paid) and
     * we don't actually know when it was done. It also allows for me to receive
     * an amount that is not the full amount and not continually add it to the
     * group of payments for that infringement (otherwise we may reach an
     * infinite amount).
     *
     * @param infringement
     * @param payment
     */
    async upsertExternalPayment(infringement: Infringement, payment: Partial<Payment> = {}) {
        // Check if we should even insert or update a payment, if not, just
        // leave
        if (!this.shouldCheck(infringement, payment)) {
            return null;
        }

        // Update total payments for the infringement
        infringement.totalPayments = await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(
            infringement.infringementId,
        );

        const payments = await this.getPaymentService.getForInfringement(infringement.infringementId);

        // If there were no payments, then just create an external payment,
        // using the partial data if it exists
        if (payments.length === 0) {
            this.logger.debug({
                fn: this.upsertExternalPayment.name,
                message: `Creating a payment for infringement ${infringement.infringementId} because it doesn't have any payments linked to it`,
                detail: {
                    infringement,
                    payment,
                },
            });
            return await this.createPayment(infringement, payment);
        }

        // At this point, we already have logs of a payment (or payments) so
        // now we need to update or add another entry to the payments that
        // were made
        const amount = this.calculateTotalAmountPaid(payments);
        const infringementAmount = Number(infringement.amountDue);
        const totalAmount = Number(infringement.totalAmount);
        if (infringementAmount === amount || totalAmount === amount || infringementAmount === 0) {
            // At this point, we KNOW the infringement was fully paid but we
            // don't know who much was still outstanding before (if any).
            const found = await this.findAndUpdatePayment(payments, payment);

            if (found) {
                this.logger.debug({
                    fn: this.upsertExternalPayment.name,
                    message: `Updated a payment that already existed for infringement ${infringement.infringementId}`,
                    detail: {
                        infringement,
                        payment,
                        found,
                    },
                });
                return found;
            } else if (totalAmount - amount > 0) {
                // At this point we know we couldn't find a payment but the
                // infringement has been fully paid. So we create whichever
                // payment is required to get it to equal 0.
                payment.amountPaid = (totalAmount - amount).toString();
                this.logger.debug({
                    fn: this.upsertExternalPayment.name,
                    message: `Creating the final payment for infringement ${infringement.infringementId}`,
                    detail: {
                        infringement,
                        payment,
                        found,
                    },
                });
                return this.createPayment(infringement, payment);
            }

            // If we get here it likely means that the amount is equal to the
            // total amount so we don't need to do anything.
            return null;
        }

        if (payment.amountPaid) {
            const newTotalAmount = amount + Number(payment.amountPaid);
            if (newTotalAmount > totalAmount) {
                this.logger.warn({
                    fn: this.upsertExternalPayment.name,
                    message: `The new total for payment ${newTotalAmount} is larger than the infringement amount ${totalAmount}`,
                    detail: {
                        infringement,
                        payment,
                    },
                });
            }
        } else {
            const newAmount =
                Number(infringement.amountDue) - amount > 0
                    ? Number(infringement.amountDue) - amount
                    : Number(infringement.totalAmount) - amount;
            if (newAmount < 0) {
                this.logger.error({
                    fn: this.upsertExternalPayment.name,
                    message: `The total amount for infringement ${infringement.infringementId} would add up to more than the total on the infringement`,
                    detail: {
                        infringement,
                        payment,
                        alreadyPaid: amount,
                    },
                });
                return null;
            }
            payment.amountPaid = newAmount.toString();
        }

        // Now we create the new payment
        this.logger.debug({
            fn: this.upsertExternalPayment.name,
            message: `Creating a payment for infringement ${infringement.infringementId}`,
            detail: {
                infringement,
                payment,
                alreadyPaid: amount,
            },
        });
        return await this.createPayment(infringement, payment);
    }

    /**
     * Checks if we should even be doing a check or creating a payment. If the
     * payment object is empty and the infringement isn't marked as paid then
     * there is no point.
     * @param infringement
     * @param payment
     */
    public shouldCheck(infringement: Infringement, payment: Partial<Payment>): boolean {
        return (
            Number(infringement.amountDue) === 0 ||
            infringement.status === InfringementStatus.Paid ||
            !!payment.paymentDate ||
            !!payment.amountPaid
        );
    }

    /**
     * Returns the sum of all of the payments made
     * @param payment
     * @private
     */
    private calculateTotalAmountPaid(payment: Payment[]): number {
        let total = 0;
        payment.forEach((p) => (total += Number(p.amountPaid)));
        return total;
    }

    /**
     * Creates the external payment using the details from the payment object.
     * @param infringement
     * @param payment
     * @private
     */
    private async createPayment(infringement: Infringement, payment: Partial<Payment>) {
        const dto: CreateExternalPaymentDto = {
            ...this.fillDefaultPaymentDetails(infringement, payment),
            infringement,
        };
        this.logger.debug({ message: 'Creating External Payment', detail: dto, fn: this.createPayment.name });
        try {
            const created = ExternalPayment.create(dto);
            if (!!dto.amountPaid && Number(dto.amountPaid) > 0) {
                // Check if there is a previous successful infringement and remove it before making a new one
                const lastSuccessfulPayment = await Payment.findWithMinimalRelations()
                    .leftJoinAndSelect('payment.successfulInfringement', 'successful')
                    .andWhere('successful.infringementId = :id', { id: infringement.infringementId })
                    .getOne();
                if (!!lastSuccessfulPayment) {
                    lastSuccessfulPayment.successfulInfringement = null;
                    await lastSuccessfulPayment.save();
                }

                created.successfulInfringement = infringement;
            }
            this.logger.debug({ message: `Updated latest payment.`, fn: this.createPayment.name });
            const externalPayment = await created.save();
            this.logger.debug({ message: 'Saved External Payment', detail: externalPayment, fn: this.createPayment.name });

            // Update total payments
            await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(externalPayment.infringement.infringementId);

            return externalPayment;
        } catch (error) {
            this.logger.error({ message: 'Failed to create an External Payment', detail: { error, dto }, fn: this.createPayment.name });
            return;
        }
    }

    /**
     * Adds default information to the payment object which can be helpful when
     * you need to create a new one using only the fact that an infringement
     * has been marked as paid and nothing more.
     * @param infringement
     * @param payment
     * @private
     */
    private fillDefaultPaymentDetails(infringement: Infringement, payment: Partial<Payment>) {
        const finalPayment = this.fillInPaymentAmount(infringement, payment);
        finalPayment.paymentDate =
            finalPayment.paymentDate || infringement.nomination?.paidDate || momentTimezone.tz(Config.get.app.timezone).toISOString();
        finalPayment.externalReference = finalPayment.externalReference || `Automated external payment`;
        return finalPayment;
    }

    /**
     * Fills in the payment amount from the infringement if the payment object
     * didn't already have the amount set
     * @param infringement
     * @param payment
     * @private
     */
    private fillInPaymentAmount(infringement: Infringement, payment: Partial<Payment>) {
        const finalPayment = cloneDeep(payment);
        finalPayment.amountPaid = finalPayment.amountPaid || infringement.amountDue;
        if (Number(finalPayment.amountPaid) === 0) {
            // As a last resort, we set this to the total amount
            finalPayment.amountPaid = infringement.totalAmount;
        }
        finalPayment.amountPaid = new BigNumber(finalPayment.amountPaid).toFormat(2);
        return finalPayment;
    }

    /**
     * Finds a payment and updates it with any new information. If it doesn't
     * find a payment it will return null.
     *
     * We throw exceptions here if we're going to overwrite data because that's
     * a dangerous operation and I don't want to perform that unless it's
     * entirely necessary.
     * @param payments
     * @param payment
     * @private
     */
    private async findAndUpdatePayment(payments: Payment[], payment: Partial<Payment>) {
        const foundPayment = this.findMatchingPayment(payments, payment);
        if (!foundPayment) {
            return null;
        }
        if (!isEqual(foundPayment.details, payment.details) && !isNil(foundPayment.details) && !isNil(payment.details)) {
            this.logger.error({
                fn: this.findAndUpdatePayment.name,
                message: `Trying to update the details on a payment which could lead to loss of information`,
                detail: {
                    foundPayment,
                    payment,
                },
            });
            throw new TryingToOverridePaymentDetailsException(foundPayment, payment);
        }
        if (Number(foundPayment.amountPaid) !== Number(payment.amountPaid)) {
            this.logger.error({
                fn: this.findAndUpdatePayment.name,
                message: `Trying to update the amount paid on a payment which could lead to loss of information`,
                detail: {
                    foundPayment,
                    payment,
                },
            });
            throw new TryingToOverridePaymentDetailsException(foundPayment, payment);
        }
        foundPayment.details = foundPayment.details || payment.details;
        foundPayment.externalReference = foundPayment.externalReference || payment.externalReference;
        return await foundPayment.save();
    }

    /**
     * Finds a payment in the array of existing payments that matches the
     * object being passed in. If there isn't a match, it returns null.
     *
     * @param payments
     * @param payment
     * @private
     */
    private findMatchingPayment(payments: Payment[], payment: Partial<Payment>) {
        // The easiest find is if the incoming payment has a payment id, we can
        // then just find the matching one in the array
        const idMatch = payments.find((p) => p.paymentId === payment.paymentId);
        if (idMatch) {
            return idMatch;
        }

        // If there is a payment date then we need to see if there's a match
        // with one of the payments in the array
        if (payment.paymentDate) {
            const currentPaymentDate = moment(payment.paymentDate);
            const dateMatch = payments.find((p) => moment(p.paymentDate).isSame(currentPaymentDate));
            return dateMatch ? dateMatch : null;
        }

        // If there is no payment date, then we need to see if the amount
        // matches any of the payments in the array.
        if (payment.amountPaid) {
            const paymentAmount = Number(payment.amountPaid);
            const amountMatch = payments.find((p) => paymentAmount === Number(p.amountPaid));
            return amountMatch ? amountMatch : null;
        }

        return null;
    }
}
