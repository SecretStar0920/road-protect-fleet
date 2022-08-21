import { Integration } from '@entities';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { Injectable } from '@nestjs/common';
import { Config } from '@config/config';
import { Logger } from '@logger';
import { ATGRedirectionDetails, ATGRedirectionRequest, ATGRedirectionSystemHeader } from './models/atg-redirection-details.model';
import { get, omit } from 'lodash';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { omitUnreadable } from '@modules/shared/helpers/omit-unreadable';
import { httpClient } from '@modules/shared/http-client/http-client';

export enum RedirectionAutomationEnvironment {
    Production = 'Production',
    Sandbox = 'Sandbox',
}

export class AutomationRedirectionData {
    @IsNumber()
    issuerAtgId: number;
    @IsString()
    ownerBrn: string;
    @IsString()
    noticeNumber: string;
    @IsString()
    vehicleRegistration: string;
    @IsString()
    streetNumber: string;
    @IsNumber()
    isDriver: number;
    @IsString()
    @IsOptional()
    apartmentNumber?: string;
    @IsString()
    targetName: string;
    @IsString()
    @IsOptional()
    targetSurname?: string;
    @IsString()
    streetName: string;
    @IsString()
    streetCode: string;
    @IsString()
    @IsOptional()
    zipCode: string;
    @IsString()
    cityCode: string;
    @IsString()
    cityName: string;
    @IsString()
    userBrn: string;
    @IsString()
    powerOfAttorneyDocument: string; // Base 64
    @IsString()
    leaseOrRedirectionDocument: string; // Base 64
    @IsString()
    infringementDocument: string; // Base 64
    @IsString()
    licenseNumber: string;
}

@Injectable()
export class RedirectionAutomationIntegration {
    protected production: string = 'https://apiexternalproxies.ladpc.net.il/WebApiFineChangeAddress';
    protected sandbox: string = 'https://portalsvcdevbe.ladpc.net.il/WebApiFineChangeAddress';

    private currentEnvironment: RedirectionAutomationEnvironment =
        Config.get.isStaging() || Config.get.isDevelopment()
            ? RedirectionAutomationEnvironment.Sandbox
            : RedirectionAutomationEnvironment.Production;
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;

    protected getUrl(path: string): string {
        if (this.currentEnvironment === RedirectionAutomationEnvironment.Sandbox) {
            return `${this.sandbox}/${path}`;
        } else {
            return `${this.production}/${path}`;
        }
    }

    async redirectInfringement(redirectionData: AutomationRedirectionData) {
        const body = this.getBody(redirectionData);
        const url = this.getUrl('FineChangeAddress');
        this.logger.debug({
            message: 'Making Redirection Request to ATG',
            detail: {
                redirectionData: omitUnreadable(redirectionData),
                url,
                body: omitUnreadable(body),
            },
            fn: this.redirectInfringement.name,
        });

        let response;
        try {
            response = await httpClient
                .post(url, {
                    json: body,
                })
                .json();
        } catch (error) {
            await this.integrationRequestLogger.logFailed(
                Integration.AutomationRedirectInfringement,
                omit(body, ['appData.Documents']),
                error,
            );
            throw error;
        }

        this.logger.debug({
            message: 'Received redirection response from ATG',
            detail: { response },
            fn: this.redirectInfringement.name,
        });

        const responseMessage = get(response, 'Msg.RcMessage', 'Unknown response');
        const rcType = +get(response, 'Msg.RcType', 0);

        if (responseMessage === 'OK') {
            if (rcType === 1) {
                await this.integrationRequestLogger.logSuccessful(
                    Integration.AutomationRedirectInfringement,
                    omit(body, ['appData.Documents']),
                    response,
                );
                return response;
            } else {
                await this.integrationRequestLogger.logFailed(
                    Integration.AutomationRedirectInfringement,
                    omit(body, ['appData.Documents']),
                    response,
                );
                throw { message: 'Redirection request failed from our partners', responseMessage, response, rcType };
            }
        } else {
            await this.integrationRequestLogger.logFailed(
                Integration.AutomationRedirectInfringement,
                omit(body, ['appData.Documents']),
                response,
            );
            throw { message: 'Redirection request failed from our partners', responseMessage, response };
        }
    }

    getBody(redirectionData: AutomationRedirectionData): ATGRedirectionDetails {
        const body: ATGRedirectionDetails = new ATGRedirectionDetails({
            systemHeader: new ATGRedirectionSystemHeader({
                Customer: redirectionData.issuerAtgId,
            }),
            appData: new ATGRedirectionRequest({
                Asmachta: redirectionData.ownerBrn,
                Heara: '',
                MisparDoch: redirectionData.noticeNumber,
                // TaarichMazav: '',
                ImotData: { MisparRechev: redirectionData.vehicleRegistration },
                Bait: redirectionData.streetNumber,
                Mahut: redirectionData.isDriver || 1,
                Mishpaha: redirectionData.targetName,
                Prati: redirectionData.targetSurname || '',
                Rechov: redirectionData.streetName,
                SemelRechov: redirectionData.streetCode,
                Mikud: redirectionData.zipCode || '',
                SemelYeshuv: redirectionData.cityCode,
                Yeshuv: redirectionData.cityName,
                Zehut: redirectionData.userBrn,
                Documents: [
                    {
                        DocType: '1',
                        EncodedFile: redirectionData.powerOfAttorneyDocument,
                    },
                    {
                        DocType: '2',
                        EncodedFile: redirectionData.leaseOrRedirectionDocument,
                    },
                    {
                        DocType: '3',
                        EncodedFile: redirectionData.infringementDocument,
                    },
                ],
            }),
        });

        return body;
    }
}
