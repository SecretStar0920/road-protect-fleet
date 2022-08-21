import { Config } from '@config/config';
import { Infringement, Issuer, LeaseContract } from '@entities';
import { Logger } from '@logger';
import { DocumentFileDto, GetDocumentService } from '@modules/document/services/get-document.service';
import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { GenerateMunicipalRedirectionDocumentService } from '@modules/nomination/services/generate-municipal-redirection-document.service';
import { MunicipalRedirectionEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { SendFaxDto, SendFaxService } from '@modules/shared/modules/fax/services/send-fax.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { DriverRedirectionService } from '@modules/nomination/services/redirection/driver-redirection.service';

@Injectable()
export class ManualRedirectionService {
    constructor(
        public logger: Logger,
        public generateRedirectionDocument: GenerateMunicipalRedirectionDocumentService,
        public getDocumentService: GetDocumentService,
        public emailService: EmailService,
        public driverRedirectionService: DriverRedirectionService,
        public sendFaxService: SendFaxService,
    ) {}

    async redirect(nominationId: number, redirectionDetails: MunicipalRedirectionDetails, socket: DistributedWebsocket) {
        socket.emit('municipal-redirection', { message: 'Generating redirection PDF document' });
        const generateRedirectionDocumentResult = await this.generateRedirectionDocument.generateDocumentation(
            nominationId,
            redirectionDetails,
        );
        socket.emit('municipal-redirection', { message: 'Generated redirection document' });

        //////////////////////////////////////////////////////////////////
        // Prepare some data variables
        //////////////////////////////////////////////////////////////////

        const nomination = generateRedirectionDocumentResult.nomination;
        const infringement = nomination.infringement;
        const issuer = infringement.issuer;
        const contract = infringement.contract as LeaseContract;

        //////////////////////////////////////////////////////////////////
        // Get the documentation ready
        //////////////////////////////////////////////////////////////////

        const file = await this.getDocumentService.getDocumentFile(generateRedirectionDocumentResult.mergedDocument.documentId);
        socket.emit('municipal-redirection', { message: 'Contacting the municipality' });

        // Decide on email or fax
        if (!isEmpty(issuer.redirectionEmail)) {
            await this.sendRedirectionViaEmail(issuer.redirectionEmail, issuer, infringement, contract, socket, file);
        } else if (!isEmpty(issuer.fax)) {
            await this.sendRedirectionViaFax(issuer, socket, file);
        } else {
            socket.emit('municipal-redirection', {
                message: `We do not have fax or email contact details for ${issuer.name}`,
                type: 'error',
            });
            throw new BadRequestException({ message: ERROR_CODES.E090_NoContactDetailsForIssuer.message({ issuerName: issuer.name }) });
        }
        socket.emit('municipal-redirection', { message: 'Municipality contacted' });

        return generateRedirectionDocumentResult.nomination;
    }

    protected async sendRedirectionViaEmail(
        email: string,
        issuer: Issuer,
        infringement: Infringement,
        contract: LeaseContract,
        socket: DistributedWebsocket,
        file: DocumentFileDto,
    ) {
        const emailTemplate: MunicipalRedirectionEmail = {
            name: '',
            issuerName: issuer.name,
            vehicleRegistration: infringement.vehicle.registration,
            noticeNumber: infringement.noticeNumber,
            ownerName: contract.owner.name,
            ownerIdentifier: contract.owner.identifier,
            targetName: contract.user.name,
            targetIdentifier: contract.user.identifier,
        };

        // Check for driver contract
        const driverContract = await this.driverRedirectionService.getDriverContract(infringement.infringementId);
        if (!!driverContract?.contractId) {
            emailTemplate.targetName = driverContract.driver.name + ' ' + driverContract.driver.surname;
            emailTemplate.targetIdentifier = driverContract.driver.licenseNumber;
        }

        socket.emit('municipal-redirection', { message: 'Sending the email' });
        await this.emailService.sendEmail({
            template: EmailTemplate.MunicipalRedirection,
            to: email,
            from: Config.get.email.redirectionEmail,
            bcc: [Config.get.email.debugEmail],
            subject: ` בקשה להסבה קנס מספר${infringement.noticeNumber}`,
            context: emailTemplate,
            attachments: [
                {
                    filename: `redirection-${infringement.noticeNumber}.pdf`,
                    content: file.file,
                },
            ],
            lang: 'he',
        });
    }

    protected async sendRedirectionViaFax(issuer: Issuer, socket: DistributedWebsocket, file: DocumentFileDto) {
        const faxTemplate: SendFaxDto = {
            faxNumber: issuer.fax,
            fileUrl: `${Config.get.app.url}/api/v1/public-document/fax/${file.document.documentId}`,
        };
        this.logger.debug({ message: 'Sending fax', fn: this.sendRedirectionViaFax.name, detail: faxTemplate });
        socket.emit('municipal-redirection', { message: 'Sending the fax' });
        try {
            const result = await this.sendFaxService.sendFax(faxTemplate);
            this.logger.debug({ message: 'Sent fax', fn: this.sendRedirectionViaFax.name, detail: result });
            socket.emit('municipal-redirection', { message: 'Fax sent' });
        } catch (e) {
            this.logger.error({ message: 'Failed to send fax', fn: this.sendRedirectionViaFax.name, detail: e });
            socket.emit('municipal-redirection', { message: `Failed to send the fax, please contact support`, type: 'error' });
            throw new InternalServerErrorException({ message: ERROR_CODES.E089_FailedToSendFax.message() });
        }
    }
}
