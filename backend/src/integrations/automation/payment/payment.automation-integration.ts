import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { parseStringPromise } from 'xml2js';
import { Config } from '@config/config';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, Infringement, Integration, Issuer } from '@entities';
import { EncryptionHelper } from '@modules/shared/helpers/encryption.helper';
import { ICreditCard } from '@config/payment';
import { v4 } from 'uuid';
import { BigNumber } from 'bignumber.js';
import { ParkingCheckBill } from '@integrations/automation/payment/parking-check-bill-response.interface';
import { get } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';
import * as moment from 'moment';

export interface PaymentAnswer {
    Stage: string;
    OperationId: string;
    ActionCode: string;
    Description: string;
    TransactionId: string;
    IskaNumber: string;
    Sum: string;
    ShvaDealNum: string;
}

export interface ParkingPaymentV3Response {
    'soap:Envelope': { 'soap:Body': { ParkingPaymentsV3Response: ParkingPaymentsV3ResponseResult } };
}
export interface ParkingPaymentsV3ResponseResult {
    ParkingPaymentsV3Result: string;
    PaymentAnswer?: PaymentAnswer; // This is the parsed version of the xml string above
}

export interface PaymentResult {
    success: boolean;
    result: { error?: any; response?: any; message: string };
}

export abstract class PaymentIntegration {
    protected productionUrl: string;
    protected sandboxUrl: string;

    // TODO add more standard methods that should be implemented
    abstract async pay(infringement: Infringement, account: Account, reference: string, cvv?: string);
}

@Injectable()
export class AutomationPaymentIntegration extends PaymentIntegration {
    protected productionUrl = 'https://www.citypay.co.il/CityPayWS/CityPay.asmx';
    protected sandboxUrl = 'http://test.citypay.co.il/CityPayWS/CityPay.asmx';
    private integrationRequestLogger = IntegrationRequestLogger.instance;

    constructor(private logger: Logger) {
        super();
    }

    /** This is an old request that is returning empty. It is now bypassed with the synchronous verification
     */
    /*
async verifyInfringement(infringement: Infringement): Promise<{ successful: boolean; detail: any }> {
   st issuer = await Issuer.findWithMinimalRelations()
        .andWhere('issuer.issuerId = :issuerId', { issuerId: infringement.issuer.issuerId })
        .getOne();
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <ParkingCheckBill xmlns="http://tempuri.org/">
          <CallerId>20</CallerId>
          <TransactionId>${infringement.infringementId}</TransactionId>
          <RashutCode>${(issuer.integrationDetails as any).code}</RashutCode>
          <ServiceCode>4</ServiceCode>
          <ReportMovilNum>${infringement.noticeNumber}</ReportMovilNum>
          <CarIdNum>${infringement.vehicle.registration}</CarIdNum>
        </ParkingCheckBill>
      </soap:Body>
    </soap:Envelope>`;

    if (Config.get.isDevelopment() || Config.get.isStaging()) {
        return {
            successful: Math.random() > 0.5,
            detail: '[TEST/STAGING] verification for development and staging, can randomly be successful or invalid',
        };
    }
    try {
        this.logger.debug({ message: 'Verify infringement request to ATG', detail: { body }, fn: this.verifyInfringement.name });

        const response = httpClient
            .post(this.getUrl(), {
                body,
                headers: { 'content-type': 'text/xml' },
                responseType: 'text',
            })
            .then((d) => d.body);

        await this.integrationRequestLogger.logSuccessful(Integration.AutomationVerifyInfringementSum, body, response);

        this.logger.debug({
            message: 'Verify infringement response from ATG [Preparse]',
            detail: { response },
            fn: this.verifyInfringement.name,
        });
        const responseJson: ParkingCheckBill = await parseStringPromise(response, {
            trim: true,
            normalizeTags: false,
            explicitArray: false,
        });
        this.logger.debug({
            message: 'Verify infringement response from ATG [Parsed]',
            detail: { response: responseJson },
            fn: this.verifyInfringement.name,
        });
        const responseBody = responseJson['soap:Envelope']['soap:Body'].ParkingCheckBillResponse.ParkingCheckBillResult;
        // If actioncode === 1000 it was successful

        //////////////////////////////////////////////////////////////////
        // Check Action Code
        //////////////////////////////////////////////////////////////////
        const actionCode = Number(responseBody.ActionCode);
        const actionSuccessful = actionCode === 1000;

        if (!actionSuccessful) {
            const message = 'Failed to verify infringement with action code failure';
            this.logger.error({ message, detail: { responseJson, actionCode, actionSuccessful }, fn: this.verifyInfringement.name });
            return {
                successful: false,
                detail: { message, responseJson, actionCode, actionSuccessful, actionDescription: responseBody.Description },
            };
        }

        //////////////////////////////////////////////////////////////////
        // Check Amount
        //////////////////////////////////////////////////////////////////
        const amount = new BigNumber(responseBody.Sum);
        const amountUnchanged = amount.isEqualTo(new BigNumber(infringement.amountDue));

        if (!amountUnchanged) {
            const message =
                'Failed to verify infringement because amount has changed, please view the new amount and retry the payment';
            this.logger.error({
                message,
                detail: { responseJson, amount, amountUnchanged, actionDescription: responseBody.Description },
                fn: this.verifyInfringement.name,
            });

            infringement.amountDue = amount.toFixed(2);
            await infringement.save();

            return { successful: false, detail: { message, responseJson, amount, amountUnchanged } };
        }

        //////////////////////////////////////////////////////////////////
        // Successful
        //////////////////////////////////////////////////////////////////
        return { successful: true, detail: responseJson };
    } catch (e) {
        this.logger.error({
            message: 'Error verifying infringement with ATG',
            detail: { error: e, body, url: this.getUrl() },
            fn: this.verifyInfringement.name,
        });
        await this.integrationRequestLogger.logFailed(Integration.AutomationVerifyInfringementSum, body, e);
        return { successful: false, detail: { infringement } };
    }
    }
*/

    /**
     * Used for non-PCI municipalities to pay via Automation with RP Credit Card details
     */
    async payWithRpCard(infringement: Infringement, account: Account, reference: string = v4()): Promise<PaymentResult> {
        const issuer = await Issuer.findWithMinimalRelations()
            .andWhere('issuer.issuerId = :issuerId', { issuerId: infringement.issuer.issuerId })
            .getOne();

        // At this point it is assumed that the infringement has been verified
        // Check for verification
        if (moment(infringement.externalChangeDate).isBefore(moment().subtract(Config.get.payment.paymentVerificationHours, 'hours'))) {
            throw new BadRequestException({
                message: `The infringement has not been verified in the last ${Config.get.payment.paymentVerificationHours} hours. Verify the infringement and try again.`,
            });
        }

        // Get card details
        const cardDetails: ICreditCard = EncryptionHelper.decryptJSON(Config.get.payment.rpCreditCard);

        // Make payment via soap
        const body = `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <ParkingPaymentsV3 xmlns="http://tempuri.org/">
                  <CallerId>20</CallerId>
                  <TransactionId>${reference}</TransactionId>
                  <RashutCode>${(issuer.integrationDetails as any).code}</RashutCode>
                  <ServiceCode>4</ServiceCode>
                  <ReportMovilNum>${infringement.noticeNumber}</ReportMovilNum>
                  <CarIdNum>${infringement.vehicle.registration}</CarIdNum>
                  <Sum>${infringement.amountDue}</Sum>
                  <CCNumber>${cardDetails.number}</CCNumber>
                  <cvv2>${cardDetails.cvv}</cvv2>
                  <CCValidDate>${cardDetails.exp}</CCValidDate>
                  <PaymentsNumber>1</PaymentsNumber>
                  <IdNumber>${cardDetails.holderId || Config.get.systemSignature.Ore.id}</IdNumber>
                  <CreditType>1</CreditType>
                  <IntOt></IntOt>
                  <TashlumDate></TashlumDate>
                  <PayerName>${account.name}</PayerName>
                  <PayerAddress>${account.physicalLocation?.address || account.postalLocation.address}</PayerAddress>
                  <PayerSettlement>${account.physicalLocation?.city || account.postalLocation.city}</PayerSettlement>
                  <PayerZipCode>${account.physicalLocation?.code || account.postalLocation.code}</PayerZipCode>
                  <PayerPhoneNumber>${account.details.telephone || Config.get.automation.defaultContactNumber}</PayerPhoneNumber>
                  <PayerEmail>${account.primaryContact || ''}</PayerEmail>
                </ParkingPaymentsV3>
              </soap:Body>
            </soap:Envelope>`;

        // FIXME: Dev testing

        try {
            this.logger.debug({
                message: 'Making payment request to ATG with RP Card',
                detail: { rawRequest: body.replace(cardDetails.cvv, 'HIDDEN_CVV') },
                fn: this.pay.name,
                encrypt: true,
            });

            if (Config.get.isDevelopment() || Config.get.isStaging()) {
                return { success: true, result: { message: '[TEST RESULT] Payment successful' } };
            }

            const response = await httpClient.post(this.getUrl(), {
                body,
                headers: { 'content-type': 'text/xml' },
            });

            this.logger.debug({ message: 'ATG payment response [ Preparse ]', detail: { response }, fn: this.pay.name });
            // Parse XML to json
            const parsedResponse: ParkingPaymentV3Response = await parseStringPromise(response, {
                trim: true,
                normalizeTags: false,
                explicitArray: false,
            });
            this.logger.debug({ message: 'ATG payment response [ Parsed ]', detail: { responseJson: parsedResponse }, fn: this.pay.name });

            // Check has response
            const hasResponse = !!get(parsedResponse, `soap:Envelope.soap:Body.ParkingPaymentsV3Response.ParkingPaymentsV3Result`, false);
            if (!hasResponse) {
                this.logger.error({ message: 'No response as expected from ATG for payment', detail: parsedResponse, fn: this.pay.name });
                throw new InternalServerErrorException({
                    message: ERROR_CODES.E074_UnexpectedResponseFromProvider.message(),
                    detail: parsedResponse,
                });
            }

            // Parse sub XML which comes in as a string
            parsedResponse['soap:Envelope']['soap:Body'].ParkingPaymentsV3Response.PaymentAnswer = await parseStringPromise(
                parsedResponse['soap:Envelope']['soap:Body'].ParkingPaymentsV3Response.ParkingPaymentsV3Result,
                {
                    trim: true,
                    normalizeTags: false,
                    explicitArray: false,
                },
            );

            const wasSuccessful: boolean =
                Number(parsedResponse['soap:Envelope']['soap:Body'].ParkingPaymentsV3Response.PaymentAnswer.ActionCode) === 1000;
            return { success: wasSuccessful, result: { response: parsedResponse, message: 'Payment successful' } };
        } catch (error) {
            this.logger.error({
                message: 'Error making payment with RP Credit Card to ATG',
                detail: { error },
                fn: this.payWithRpCard.name,
            });
            return { success: false, result: { error, message: 'Failed to make payment to Municipality' } };
        }
    }

    /**
     * Check amount is in cents or ILS
     */
    async pay(infringement: Infringement, account: Account, reference: string, cvv?: string): Promise<PaymentResult> {
        const issuer = await Issuer.findWithMinimalRelations()
            .andWhere('issuer.issuerId = :issuerId', { issuerId: infringement.issuer.issuerId })
            .getOne();

        // At this point it is assumed that the infringement has been verified
        // Check for verification
        if (moment(infringement.externalChangeDate).isBefore(moment().subtract(Config.get.payment.paymentVerificationHours, 'hours'))) {
            throw new BadRequestException({
                message: `The infringement has not been verified in the last ${Config.get.payment.paymentVerificationHours} hours. Verify the infringement and try again.`,
            });
        }

        // Decrypt token and details
        account.atgCreditGuard.unsecureEntity();

        const body = `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <ParkingPaymentsV3 xmlns="http://tempuri.org/">
                  <CallerId>20</CallerId>
                  <TransactionId>${reference}</TransactionId>
                  <RashutCode>${(issuer.integrationDetails as any).code}</RashutCode>
                  <ServiceCode>4</ServiceCode>
                  <ReportMovilNum>${infringement.noticeNumber}</ReportMovilNum>
                  <CarIdNum>${infringement.vehicle.registration}</CarIdNum>
                  <Sum>${infringement.amountDue}</Sum>
                  <CCNumber>${account.atgCreditGuard.raw.cardToken}</CCNumber>
                  <cvv2>${cvv}</cvv2>
                  <CCValidDate>${account.atgCreditGuard.raw.cardExp}</CCValidDate>
                  <PaymentsNumber>1</PaymentsNumber>
                  <IdNumber>${account.atgCreditGuard.raw.personalId}</IdNumber>
                  <CreditType>1</CreditType>
                  <IntOt></IntOt>
                  <TashlumDate></TashlumDate>
                  <PayerName>${account.name}</PayerName>
                  <PayerAddress>${account.physicalLocation?.address || account.postalLocation.address}</PayerAddress>
                  <PayerSettlement>${account.physicalLocation?.city || account.postalLocation.city}</PayerSettlement>
                  <PayerZipCode>${account.physicalLocation?.code || account.postalLocation.code}</PayerZipCode>
                  <PayerPhoneNumber>${account.details.telephone || Config.get.automation.defaultContactNumber}</PayerPhoneNumber>
                  <PayerEmail>${account.primaryContact || ''}</PayerEmail>
                </ParkingPaymentsV3>
              </soap:Body>
            </soap:Envelope>`;

        try {
            this.logger.debug({
                message: 'Making payment request to ATG',
                detail: { rawRequest: body.replace(cvv, 'HIDDEN_CVV') },
                fn: this.pay.name,
                encrypt: true,
            });

            if (Config.get.isDevelopment() || Config.get.isStaging()) {
                return { success: Math.random() >= 0.5, result: { message: '[TEST/STAGING RESULT] - skipped integration' } };
                // return { success: false, result: { message: '[TEST RESULT] Payment failed, blah' } };
            }

            const response = await httpClient
                .post(this.getUrl(), {
                    body,
                    headers: { 'content-type': 'text/xml' },
                    responseType: 'text',
                })
                .then((b) => b.body);

            this.logger.debug({ message: 'ATG payment response [ Preparse ]', detail: { response }, fn: this.pay.name, encrypt: true });
            // Parse XML to json

            const parsedResponse: ParkingPaymentV3Response = await parseStringPromise(response, {
                trim: true,
                normalizeTags: false,
                explicitArray: false,
            });
            this.logger.debug({
                message: 'ATG payment response [ Parsed ]',
                detail: { responseJson: parsedResponse },
                fn: this.pay.name,
                encrypt: true,
            });

            // TODO: Fix this and rather parse the XML
            const wasSuccessful: boolean =
                (response || '').toString().indexOf('&lt;ActionCode&gt;1000&lt;/ActionCode&gt;') > -1 ||
                (response || '').toString().indexOf('<ActionCode>1000</ActionCode>') > -1;
            if (wasSuccessful) {
                this.logger.log({
                    fn: this.pay.name,
                    message: `Found the action code successfully`,
                    detail: { response },
                });
                return { success: true, result: { response: parsedResponse, message: 'Successful payment' } };
            } else {
                this.logger.warn({
                    fn: this.pay.name,
                    message: `Could not find the action code`,
                    detail: { response },
                });
                return { success: false, result: { response: parsedResponse, message: 'Failed to make payment' } };
            }
        } catch (error) {
            this.logger.error({ message: 'Error making payment with ATG', detail: { error }, fn: this.pay.name });
            return { success: false, result: { error, message: 'Failed to make payment' } };
        }
    }

    getUrl(): string {
        return Config.get.isDevelopment() ? this.sandboxUrl : this.productionUrl;
    }
}
