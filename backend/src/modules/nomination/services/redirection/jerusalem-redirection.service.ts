import { Config } from '@config/config';
import { LeaseContract, User } from '@entities';
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
import {
    JerusalemRedirectionData,
    JerusalemRedirectionIntegration,
} from '@integrations/crawlers/jerusalem/jerusalem-redirection.integration';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { DriverRedirectionService } from '@modules/nomination/services/redirection/driver-redirection.service';

@Injectable()
export class JerusalemRedirectionService {
    constructor(
        private logger: Logger,
        private generateRedirectionDocument: GenerateMunicipalRedirectionDocumentService,
        private getDocumentService: GetDocumentService,
        private extractRedirectionAddressDetailsService: ExtractRedirectionAddressDetailsService,
        public driverRedirectionService: DriverRedirectionService,
        private jerusalemRedirectionIntegration: JerusalemRedirectionIntegration,
    ) {}

    @Transactional()
    async redirect(
        nominationId: number,
        redirectionDetails: MunicipalRedirectionDetails,
        requestingUser: User,
        socket: DistributedWebsocket,
    ) {
        socket.emit('municipal-redirection', { message: 'Generating redirection PDF documentation' });
        const redirectionDocumentation = await this.generateRedirectionDocument.generateDocumentation(nominationId, redirectionDetails);
        socket.emit('municipal-redirection', { message: 'Generated redirection documentation' });

        //////////////////////////////////////////////////////////////////
        // Prepare some data variables
        //////////////////////////////////////////////////////////////////
        const nomination = redirectionDocumentation.nomination;
        this.logger.debug({ message: 'nomination =', detail: nomination, fn: this.redirect.name });
        const infringement = nomination.infringement;
        this.logger.debug({ message: 'infringement =', detail: infringement, fn: this.redirect.name });
        const contract = infringement.contract as LeaseContract;
        this.logger.debug({ message: 'contract =', detail: contract, fn: this.redirect.name });

        //////////////////////////////////////////////////////////////////
        // Get document files
        //////////////////////////////////////////////////////////////////
        socket.emit('municipal-redirection', { message: 'Getting the files ready' });
        const redirectionDocumentDto = await this.getDocumentService.getDocumentFile(redirectionDocumentation.mergedDocument.documentId);
        socket.emit('municipal-redirection', { message: 'Files are ready' });

        //////////////////////////////////////////////////////////////////
        // Address Information
        //////////////////////////////////////////////////////////////////
        const userAddressDetails = await this.extractRedirectionAddressDetailsService.extractRedirectionPhysicalAddressDetails(
            contract.user,
            socket,
        );
        const ownerAddressDetails = await this.extractRedirectionAddressDetailsService.extractRedirectionPhysicalAddressDetails(
            contract.owner,
            socket,
        );

        //////////////////////////////////////////////////////////////////
        // Create Dto
        //////////////////////////////////////////////////////////////////
        // Setup the data
        const data: JerusalemRedirectionData = {
            noticeNumber: infringement.noticeNumber,
            requestingUserEmail: requestingUser.email,
            requestingUserPhone: requestingUser.cellphoneNumber
                ? requestingUser.cellphoneNumber
                : Config.get.redirections.defaultUserCellphoneNumber,
            ownerBrn: contract.owner?.identifier,
            ownerName: contract.owner?.name,
            ownerCity: ownerAddressDetails?.issuer?.name,
            ownerStreet: ownerAddressDetails?.streetName,
            customerBrn: contract.user?.identifier,
            customerName: contract.user?.name,
            customerCity: userAddressDetails?.issuer?.name,
            customerStreet: userAddressDetails?.streetName,
            customerHomeNum: contract.user?.details?.telephone
                ? contract.user?.details?.telephone
                : Config.get.redirections.defaultUserHomeNumber,
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
            // Get driver address details
            const driverAddressDetails = await this.extractRedirectionAddressDetailsService.extractRedirectionDriverAddressDetails(
                driverContract.driver,
                socket,
            );
            if (!driverAddressDetails.valid) {
                socket.emit('municipal-redirection', { message: driverAddressDetails.message, type: 'error' });
                throw new InternalServerErrorException({
                    message: driverAddressDetails.message,
                    detail: { driverAddressDetails },
                });
            }

            // Overwrite user information with the driver information
            data.customerName = driverContract.driver.name;
            data.customerCity = driverAddressDetails?.issuer?.name;
            data.customerStreet = driverAddressDetails?.streetName;
            data.customerHomeNum = null;
            data.customerBrn = driverContract.driver.idNumber;
            data.custDrivingLicense = driverContract.driver.licenseNumber;
            data.driver = JSON.stringify(driverContract.driver);
        }

        const redirectionData = plainToClass(JerusalemRedirectionData, data);

        this.logger.debug({
            message: 'Redirection data for Jerusalem',
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
            const response = await this.jerusalemRedirectionIntegration.redirectInfringement(redirectionData);
            redirectionDocumentation.nomination.externalRedirectionReference = response.confirmationNumber;

            socket.emit('municipal-redirection', { message: 'Made request' });
            this.logger.debug({ message: 'Jerusalem Response', detail: response, fn: this.redirect.name });
        } catch (e) {
            socket.emit('municipal-redirection', {
                message: `Failed to make the redirection request, request to the integration partner was unsuccessful`,
                type: 'error',
            });
            this.logger.error({
                message: 'Jerusalem Request failed',
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
