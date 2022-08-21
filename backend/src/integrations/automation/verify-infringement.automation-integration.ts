import { Config } from '@config/config';
import { Integration } from '@entities';
import { ATGTicketDetails, ATGTicketRequest, ATGTicketResponse } from '@integrations/automation/models/atg-ticket-details.model';
import { Logger } from '@logger';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifyInfringementAutomationIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = 'https://apiexternalproxies.ladpc.net.il/WebApiGetTicketDetails/getTicketDetails';

    async retrieve(dto: ATGTicketRequest): Promise<ATGTicketResponse> {
        const body = this.getBody(dto);
        // check if we have cusomer
        if(body.appData.customer === null)
        {
            return;
        }
        this.logger.debug({ message: 'ATG retrieve ticket request', detail: { url: this.url, body }, fn: this.retrieve.name });
        try {
            const response: ATGTicketResponse = await httpClient
                .post(this.url, {
                    json: body,
                })
                .json();
            await this.integrationRequestLogger.logSuccessful(Integration.AutomationVerifyInfringement, body, response,dto.ticketNumber);
            return response;
        } catch (error) {
            await this.integrationRequestLogger.logFailed(Integration.AutomationVerifyInfringement, body, error,dto.ticketNumber);
            throw error;
        }
    }

    getBody(appData: ATGTicketRequest): ATGTicketDetails {
        return {
            systemHeader: {
                Customer: appData.customer,
                Recipient: Config.get.automation.recipient,
                Sender: Config.get.automation.sender,
                Token: '0',
                TranID: v4(),
                UserId: Config.get.automation.userId,
                UserPass: Config.get.automation.password,
                Version: Config.get.automation.version,
            },
            appData,
        };
    }

    runTest(dto: ATGTicketRequest) {
        return this.retrieve(dto);
    }
}
