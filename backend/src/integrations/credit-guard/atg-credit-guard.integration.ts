import { CreditGuardIntegration, CreditGuardIntegrationType } from '@integrations/credit-guard/credit-guard.integration';
import { Config } from '@config/config';
import * as xml2js from 'xml2js';
import { CreditGuardRequest } from '@integrations/credit-guard/credit-guard-tokenisation-request.interface';
import { CreditGuardTokenisationResponse } from '@integrations/credit-guard/credit-guard-tokenisation-response.interface';
import { CreditGuardToken } from '@entities';
import { get } from 'lodash';
import { InternalServerErrorException, NotImplementedException } from '@nestjs/common';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient, jsonToFormData } from '@modules/shared/http-client/http-client';

export class AtgCreditGuardIntegration extends CreditGuardIntegration {
    type = CreditGuardIntegrationType.ATG;
    credentials = Config.get.payment.credentials.atgCreditGuard;

    constructor() {
        super();
    }

    async chargeToken(token: CreditGuardToken) {
        throw new NotImplementedException(ERROR_CODES.E076_GeneralNotImplemented.message());
    }

    async requestToken(accountId: number, uniqueRef: string): Promise<string> {
        // Build XML request
        const xmlBuilder = new xml2js.Builder();
        const command: CreditGuardRequest = {
            ashrait: {
                request: {
                    version: '2000',
                    language: 'ENG',
                    dateTime: null,
                    command: 'doDeal',
                    doDeal: {
                        successUrl: `${Config.get.app.url}/api/v1/payment-method/update/${accountId}/success?type=${this.type}`,
                        errorUrl: `${Config.get.app.url}/api/v1/payment-method/update/${accountId}/failure?type=${this.type}`,
                        cancelUrl: `${Config.get.app.url}/home/account/profile`,
                        terminalNumber: this.credentials.tid,
                        cardNo: 'CGMPI',
                        total: '1',
                        transactionType: 'Debit',
                        creditType: 'RegularCredit',
                        currency: 'ILS',
                        transactionCode: 'Phone',
                        validation: 'TxnSetup',
                        mid: this.credentials.mid,
                        uniqueid: uniqueRef,
                        mpiValidation: 'Token', // NB
                        email: 'info@roadprotect.co.il',
                        customerData: {
                            userData1: `${accountId}`,
                        },
                    },
                },
            },
        };
        const body = {
            user: this.credentials.user,
            password: this.credentials.password,
            int_in: xmlBuilder.buildObject(command),
        };

        // Send
        this.logger.debug({
            message: 'Credit Guard Request body',
            detail: { xmlBody: body, jsonCommand: command },
            fn: this.requestToken.name,
        });

        const response = await httpClient
            .post(this.credentials.url, {
                form: jsonToFormData(body),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
            })
            .text();
        const responseJson: CreditGuardTokenisationResponse = await xml2js.parseStringPromise(response, {
            trim: true,
            normalizeTags: false,
            explicitArray: false,
        });
        this.logger.debug({
            message: 'Credit Guard Request Response',
            detail: responseJson,
            fn: this.requestToken.name,
        });
        // Return URL
        const url = get(responseJson, 'ashrait.response.doDeal.mpiHostedPageUrl', null);
        if (!url) {
            this.logger.error({ message: 'Failed to add payment method, URL missing', detail: responseJson, fn: this.requestToken.name });
            throw new InternalServerErrorException({ message: ERROR_CODES.E075_FailedToAddPaymentMethod.message() });
        }
        return url;
    }
}
