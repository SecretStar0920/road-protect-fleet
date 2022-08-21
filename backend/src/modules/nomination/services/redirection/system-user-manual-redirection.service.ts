import { LeaseContract } from '@entities';
import { Logger } from '@logger';
import { GetDocumentService } from '@modules/document/services/get-document.service';
import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { GenerateMunicipalRedirectionDocumentService } from '@modules/nomination/services/generate-municipal-redirection-document.service';
import { EmailService } from '@modules/shared/modules/email/services/email.service';
import { SendFaxService } from '@modules/shared/modules/fax/services/send-fax.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';

import { ManualRedirectionService } from '@modules/nomination/services/redirection/manual-redirection.service';
import { AsyncStorageHelper } from '@middleware/async-local-storage.middleware';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { DriverRedirectionService } from '@modules/nomination/services/redirection/driver-redirection.service';

@Injectable()
export class SystemUserManualRedirectionService extends ManualRedirectionService {
    constructor(
        logger: Logger,
        generateRedirectionDocument: GenerateMunicipalRedirectionDocumentService,
        getDocumentService: GetDocumentService,
        driverRedirectionService: DriverRedirectionService,
        emailService: EmailService,
        sendFaxService: SendFaxService,
    ) {
        super(logger, generateRedirectionDocument, getDocumentService, emailService, driverRedirectionService, sendFaxService);
    }

    async redirect(nominationId: number, redirectionDetails: MunicipalRedirectionDetails, socket: DistributedWebsocket) {
        const store = AsyncStorageHelper.getStoreSafe();
        const userIdentity = store.identity();
        socket.emit('municipal-redirection', { message: 'Generating redirection PDF document for you to send to the municipality' });
        this.logger.log({
            fn: this.redirect.name,
            detail: {
                user: userIdentity.user,
            },
            message: `Running a system user manual redirection for ${userIdentity.user?.email}`,
        });
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
        socket.emit('municipal-redirection', { message: 'Emailing the redirection document to you' });

        // Decide on email or fax
        if (!isEmpty(userIdentity.user?.email)) {
            await this.sendRedirectionViaEmail(userIdentity.user.email, issuer, infringement, contract, socket, file);
        } else {
            socket.emit('municipal-redirection', {
                message: `We do not have fax or email contact details for the user running this request`,
                type: 'error',
            });
            throw new BadRequestException({ message: ERROR_CODES.E140_DontHaveContactDetailsForUserRunningRequest.message() });
        }
        socket.emit('municipal-redirection', { message: 'Municipality contacted' });

        return generateRedirectionDocumentResult.nomination;
    }
}
