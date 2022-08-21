import { CreditGuardIntegration, CreditGuardIntegrationType } from '@integrations/credit-guard/credit-guard.integration';
import { Config } from '@config/config';
import * as xml2js from 'xml2js';
import { CreditGuardRequest } from '@integrations/credit-guard/credit-guard-tokenisation-request.interface';
import { CreditGuardTokenisationResponse } from '@integrations/credit-guard/credit-guard-tokenisation-response.interface';
import { CreditGuardToken } from '@entities';
import { get } from 'lodash';
import { InternalServerErrorException } from '@nestjs/common';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient, jsonToFormData } from '@modules/shared/http-client/http-client';

export class RpCreditGuardIntegration extends CreditGuardIntegration {
    type = CreditGuardIntegrationType.RP;
    credentials = Config.get.payment.credentials.rpCreditGuard;

    async chargeToken(
        token: CreditGuardToken,
        amount: string,
        reference,
        cvv: string,
    ): Promise<{ success: boolean; result: any & { responseJson: CreditGuardTokenisationResponse } }> {
        // Prepare request
        token.unsecureEntity(); // Decrypt the token
        const xmlBuilder = new xml2js.Builder();
        const command: CreditGuardRequest = {
            ashrait: {
                request: {
                    version: '2000',
                    language: 'ENG',
                    command: 'doDeal',
                    mayBeDuplicate: '0',
                    doDeal: {
                        terminalNumber: this.credentials.tid,
                        cardNo: token.raw.cardToken,
                        cardExpiration: token.raw.cardExp,
                        transactionType: 'Debit',
                        creditType: 'RegularCredit',
                        currency: 'ILS',
                        transactionCode: 'Phone',
                        total: amount,
                        validation: 'AutoComm',
                        uniqueid: reference,
                        user: '1',
                    },
                },
            },
        };
        const body = {
            user: this.credentials.user,
            password: this.credentials.password,
            int_in: xmlBuilder.buildObject(command),
        };

        this.logger.debug({
            message: 'Credit Guard Request body',
            detail: { xmlBody: body, jsonCommand: command },
            fn: this.chargeToken.name,
            encrypt: true,
        });

        // Send request
        // FIXME: mocking for now
        if (Config.get.isDevelopment() || Config.get.isStaging()) {
            return { success: true, result: '[TEST RESPONSE] Transferred funds' };
        }

        const response = await httpClient
            .post(this.credentials.url, {
                form: jsonToFormData(body),
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            })
            .text();

        const responseJson: CreditGuardTokenisationResponse = await xml2js.parseStringPromise(response, {
            trim: true,
            normalizeTags: false,
            explicitArray: false,
        });
        this.logger.debug({
            message: 'Credit Guard Request Response',
            detail: { responseJson, response },
            fn: this.chargeToken.name,
            encrypt: true,
        });

        if (responseJson.ashrait.response.doDeal.status === '000') {
            return { success: true, result: { responseJson, response } };
        } else {
            return { success: false, result: { responseJson, response } };
        }
        // await payment.save();
    }

    async requestToken(accountId: number, uniqueRef: string): Promise<string> {
        // Build XML request
        const xmlBuilder = new xml2js.Builder();
        const command: CreditGuardRequest = {
            ashrait: {
                request: {
                    version: '2000',
                    language: 'ENG',
                    command: 'doDeal',
                    doDeal: {
                        successUrl: `${Config.get.app.url}/api/v1/payment-method/update/${accountId}/success?type=${this.type}`,
                        errorUrl: `${Config.get.app.url}/api/v1/payment-method/update/${accountId}/failure?type=${this.type}`,
                        cancelUrl: `${Config.get.app.url}/home/account/profile`,
                        terminalNumber: this.credentials.tid,
                        cardNo: 'CGMPI',
                        total: '0',
                        transactionType: 'Debit',
                        creditType: 'RegularCredit',
                        currency: 'ILS',
                        transactionCode: 'Phone',
                        validation: 'TxnSetup',
                        mpiValidation: 'Token', // NB
                        mid: this.credentials.mid,
                        uniqueid: uniqueRef,
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
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
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
            this.logger.error({
                message: 'Failed to request adding payment method, URL missing',
                detail: responseJson,
                fn: this.requestToken.name,
            });
            throw new InternalServerErrorException({ message: ERROR_CODES.E075_FailedToAddPaymentMethod.message() });
        }
        return url;
    }
}
