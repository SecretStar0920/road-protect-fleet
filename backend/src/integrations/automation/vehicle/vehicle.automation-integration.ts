import { Integration } from '@entities';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { ATGVehicleDetails, ATGVehicleRequest } from '../models/atg-vehicle-details.model';
import { Injectable } from '@nestjs/common';
import { Config } from '@config/config';
import { Logger } from '@logger';
import { isNil } from 'lodash';
import * as moment from 'moment';
import { httpClient } from '@modules/shared/http-client/http-client';

export enum VehicleAutomationEnvironment {
    Production = 'Production',
    Sandbox = 'Sandbox',
}

@Injectable()
export class VehicleAutomationIntegration extends TestableIntegration {
    protected production: string = 'https://ApiExternalProxies.ladpc.net.il/WebApiVehicleFleet';
    protected sandbox: string = 'https://portalsvcdevbe.ladpc.net.il/WebApiVehicleFleet';

    private currentEnvironment: VehicleAutomationEnvironment = Config.get.isDevelopment()
        ? VehicleAutomationEnvironment.Sandbox
        : VehicleAutomationEnvironment.Production;
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;

    protected getUrl(path: string): string {
        if (this.currentEnvironment === VehicleAutomationEnvironment.Sandbox) {
            return `${this.sandbox}/${path}`;
        } else {
            return `${this.production}/${path}`;
        }
    }

    async addVehicle(vehicleData: ATGVehicleRequest): Promise<any> {
        const body = this.getBody(vehicleData);
        const url = this.getUrl('AddVehicle');
        this.logger.debug({ message: 'Add vehicle request', detail: { url, body }, fn: this.addVehicle.name });
        try {
            const response = await httpClient
                .post(url, {
                    json: body,
                })
                .json();
            await this.integrationRequestLogger.logSuccessful(Integration.AutomationAddVehicle, body, response);
            return response;
        } catch (error) {
            await this.integrationRequestLogger.logFailed(Integration.AutomationAddVehicle, body, error);
            throw error;
        }
    }

    async updateVehicle(vehicleData: ATGVehicleRequest) {
        const body = this.getBody(vehicleData);
        const url = this.getUrl('UpdateVehicle');
        this.logger.debug({ message: 'Update vehicle request', detail: { url, body }, fn: this.updateVehicle.name });
        try {
            const response = await httpClient
                .post(url, {
                    json: body,
                })
                .json();
            await this.integrationRequestLogger.logSuccessful(Integration.AutomationUpdateVehicle, body, response);
            return response;
        } catch (error) {
            await this.integrationRequestLogger.logFailed(Integration.AutomationUpdateVehicle, body, error);
            throw error;
        }
    }

    getBody(vehicleData: ATGVehicleRequest): ATGVehicleDetails {
        if (isNil(vehicleData.endTime)) {
            vehicleData.endTime = moment('2099-12-30T22:00:00.000Z').toISOString();
        }
        const body: ATGVehicleDetails = {
            SystemHeader: {
                customerField: 283000,
                recipientField: Config.get.automation.recipient,
                senderField: Config.get.automation.sender,
                tokenField: '1',
                tranIDField: '1',
                userIdField: Config.get.automation.userId,
                userPassField: Config.get.automation.password,
                versionField: Config.get.automation.version,
            },
            VehicleFleetRequest: {
                companyId: '515053726',
                reference: '',
                ...vehicleData,
            },
        };

        return body;
    }

    runTest(dto: any) {
        if (dto.action === 'UPDATE') {
            return this.updateVehicle(dto);
        } else {
            return this.addVehicle(dto);
        }
    }
}
