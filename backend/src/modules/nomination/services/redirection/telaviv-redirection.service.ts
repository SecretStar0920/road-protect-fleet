import { Config } from '@config/config';
import { LeaseContract, User } from '@entities';
import { TelavivRedirectionData, TelavivRedirectionIntegration } from '@integrations/crawlers/telaviv/telaviv-redirection.integration';
import { Logger } from '@logger';
import { GetDocumentService } from '@modules/document/services/get-document.service';
import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { ExtractRedirectionAddressDetailsService } from '@modules/nomination/services/extract-redirection-address-details.service';
import { GenerateMunicipalRedirectionDocumentService } from '@modules/nomination/services/generate-municipal-redirection-document.service';
import { omitUnreadable } from '@modules/shared/helpers/omit-unreadable';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { Transactional } from 'typeorm-transactional-cls-hooked';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { DriverRedirectionService } from '@modules/nomination/services/redirection/driver-redirection.service';

@Injectable()
export class TelavivRedirectionService {
    constructor(
        private logger: Logger,
        private generateRedirectionDocument: GenerateMunicipalRedirectionDocumentService,
        private getDocumentService: GetDocumentService,
        private extractRedirectionAddressDetailsService: ExtractRedirectionAddressDetailsService,
        public driverRedirectionService: DriverRedirectionService,
        private telavivRedirectionIntegration: TelavivRedirectionIntegration,
    ) {}

    @Transactional()
    async redirect(
        nominationId: number,
        redirectionDetails: MunicipalRedirectionDetails,
        requestingUser: User,
        socket: DistributedWebsocket,
    ) {
        socket.emit('municipal-redirection', { message: 'Generating redirection PDF documentation' });
        this.logger.debug({
            message: 'Calling Redirection Document Generation',
            detail: { nominationId: nominationId },
            fn: this.redirect.name,
        });
        let redirectionDocumentation;
        try{
        redirectionDocumentation = await this.generateRedirectionDocument.generateDocumentation(nominationId, redirectionDetails);
        }
        catch(e)
        {
            this.logger.error({
                message: 'Generationg Redirecton Documents Failed',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.redirect.name,
            });
            throw e;
        }
        this.logger.debug({
            message: 'After Redirection Document Generation',
            detail: { nominationId: nominationId },
            fn: this.redirect.name,
        });
        socket.emit('municipal-redirection', { message: 'Generated redirection documentation' });

        //////////////////////////////////////////////////////////////////
        // Prepare some data variables
        //////////////////////////////////////////////////////////////////
        const nomination = redirectionDocumentation.nomination;
        const infringement = nomination.infringement;
        const contract = infringement.contract as LeaseContract;

        //////////////////////////////////////////////////////////////////
        // Get document files
        //////////////////////////////////////////////////////////////////
        socket.emit('municipal-redirection', { message: 'Getting the files ready' });
        const redirectionDocumentDto = await this.getDocumentService.getDocumentFile(redirectionDocumentation.mergedDocument.documentId);
        socket.emit('municipal-redirection', { message: 'Files are ready' });

        //////////////////////////////////////////////////////////////////
        // Create Dto
        //////////////////////////////////////////////////////////////////
        // Setup the data
        const data: TelavivRedirectionData = {
            vehicleRegistration: infringement.vehicle.registration,
            noticeNumber: infringement.noticeNumber,
            ownerBrn: contract.owner?.identifier,
            ownerName: contract.owner?.name,
            requestingUserName: requestingUser?.name,
            requestingUserSurname: requestingUser?.surname,
            requestingUserPhone: requestingUser?.cellphoneNumber
                ? requestingUser?.cellphoneNumber
                : Config.get.redirections.defaultUserCellphoneNumber,
            requestingUserEmail: requestingUser?.email,
            customerBrn: contract.user?.identifier,
            customerName: contract.user?.name,
            customerCity: contract.user?.physicalLocation.city,
            customerStreet: contract.user?.physicalLocation.streetName,
            requestingUserId: Config.get.redirections.defaultUserIdNumber, // TODO: Replace this with user id number when added
            redirectionDocument: {
                value: redirectionDocumentDto.file,
                options: {
                    name: redirectionDocumentDto.document?.fileName,
                    contentType: 'application/pdf',
                },
            },
        };

        // Check for driver contract
        const driverContract = await this.driverRedirectionService.getDriverContract(infringement.infringementId);
        if (!!driverContract?.contractId) {
            // Add the driver information
            data.custDrivingLicense = driverContract.driver.licenseNumber;
            data.driver = JSON.stringify(driverContract.driver);
        }

        const redirectionData = plainToClass(TelavivRedirectionData, data);

        this.logger.debug({
            message: 'Redirection data for Telaviv',
            detail: omitUnreadable(redirectionData),
            fn: this.redirect.name,
        });

        // Validate the redirection data to ensure we have everything
        const validationErrors = await validate(redirectionData);
        if (validationErrors.length > 0) {
            this.logger.error({
                fn: this.redirect.name,
                message: `Validation failed`,
                detail: validationErrors,
            });
            socket.emit('municipal-redirection', { message: `Invalid redirection data, please contact support`, type: 'error' });
            throw new InternalServerErrorException({
                message: ERROR_CODES.E079_InvalidRedirectionData.message(),
                detail: validationErrors,
            });
        }

        //////////////////////////////////////////////////////////////////
        // Make the request
        //////////////////////////////////////////////////////////////////

        socket.emit('municipal-redirection', { message: 'Making a request to the municipality' });

        try {
            const response = await this.telavivRedirectionIntegration.redirectInfringement(redirectionData);
            redirectionDocumentation.nomination.externalRedirectionReference = response.confirmationNumber;

            socket.emit('municipal-redirection', { message: 'Made request' });
            this.logger.debug({ message: 'Telaviv Response', detail: response, fn: this.redirect.name });
        } catch (e) {
            socket.emit('municipal-redirection', {
                message: `Failed to make the redirection request, request to the integration partner was unsuccessful`,
                type: 'error',
            });
            this.logger.error({
                message: 'Telaviv Request failed',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.redirect.name,
            });
            throw new InternalServerErrorException({
                message: ERROR_CODES.E080_RedirectionFailed.message({ responseMessage: e }),
            });
        }

        return redirectionDocumentation.nomination;
    }
}
