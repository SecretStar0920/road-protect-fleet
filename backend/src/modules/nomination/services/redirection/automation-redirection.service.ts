import { LeaseContract } from '@entities';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { RedirectionAutomationIntegration, AutomationRedirectionData } from '@integrations/automation/redirection.automation-integration';
import { Logger } from '@logger';
import { GetDocumentService } from '@modules/document/services/get-document.service';
import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { ExtractRedirectionAddressDetailsService } from '@modules/nomination/services/extract-redirection-address-details.service';
import { GenerateMunicipalRedirectionDocumentService } from '@modules/nomination/services/generate-municipal-redirection-document.service';
import { omitUnreadable } from '@modules/shared/helpers/omit-unreadable';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { isNil } from 'lodash';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { DriverRedirectionService } from '@modules/nomination/services/redirection/driver-redirection.service';

@Injectable()
export class AutomationRedirectionService {
    constructor(
        private logger: Logger,
        private generateRedirectionDocument: GenerateMunicipalRedirectionDocumentService,
        private getDocumentService: GetDocumentService,
        private extractRedirectionAddressDetailsService: ExtractRedirectionAddressDetailsService,
        private redirectionAutomationIntegration: RedirectionAutomationIntegration,
        public driverRedirectionService: DriverRedirectionService,
        private issuersAutomationIntegration: AtgIssuers,
    ) {}

    async redirect(nominationId: number, redirectionDetails: MunicipalRedirectionDetails, socket: DistributedWebsocket) {
        socket.emit('municipal-redirection', { message: 'Generating redirection PDF documentation' });
        const redirectionDocumentation = await this.generateRedirectionDocument.generateDocumentation(nominationId, redirectionDetails);
        socket.emit('municipal-redirection', { message: 'Generated redirection documentation' });

        //////////////////////////////////////////////////////////////////
        // Prepare some data variables
        //////////////////////////////////////////////////////////////////

        const nomination = redirectionDocumentation.nomination;
        const infringement = nomination.infringement;
        const issuer = infringement.issuer;
        const contract = infringement.contract as LeaseContract;

        //////////////////////////////////////////////////////////////////
        // Double check the ATG issuer code
        //////////////////////////////////////////////////////////////////

        const atgIssuerCode = await this.issuersAutomationIntegration.getATGCodeByIssuerCode(issuer.code);

        // Check if the infringement can be redirected via ATG
        if (isNil(atgIssuerCode)) {
            socket.emit('municipal-redirection', { message: `Issuer not supported for automated redirections yet`, type: 'error' });
            throw new InternalServerErrorException({ message: ERROR_CODES.E078_IssuerNotSupportedForRedirections.message() });
        }

        //////////////////////////////////////////////////////////////////
        // Get document files
        //////////////////////////////////////////////////////////////////

        socket.emit('municipal-redirection', { message: 'Getting the files ready' });

        const leaseContractFile = await this.getDocumentService.getDocumentFile(redirectionDocumentation.leaseContractDocument.documentId);
        const powerOfAttorneyFile = await this.getDocumentService.getDocumentFile(
            redirectionDocumentation.powerOfAttorneyDocument.documentId,
        );
        const infringementFile = await this.getDocumentService.getDocumentFile(
            redirectionDocumentation.infringementRedirectionDocument.documentId,
        );

        socket.emit('municipal-redirection', { message: 'Files are ready' });

        //////////////////////////////////////////////////////////////////
        // Address Information
        //////////////////////////////////////////////////////////////////

        const userAddressDetails = await this.extractRedirectionAddressDetailsService.extractRedirectionAddressDetails(
            contract.user,
            socket,
        );
        if (!userAddressDetails.valid) {
            socket.emit('municipal-redirection', { message: userAddressDetails.message, type: 'error' });
            throw new InternalServerErrorException({
                message: userAddressDetails.message,
                detail: { userAddressDetails },
            });
        }

        //////////////////////////////////////////////////////////////////
        // Create Dto
        //////////////////////////////////////////////////////////////////

        // Setup the data
        const redirectionData = plainToClass(AutomationRedirectionData, {
            isDriver: 0,
            issuerAtgId: Number(atgIssuerCode),
            vehicleRegistration: infringement.vehicle.registration.toString(),
            noticeNumber: infringement.noticeNumber.toString(),
            ownerBrn: contract.owner.identifier.toString(), // FROM
            // NOMINEE DETAILS
            targetName: contract.user.name,
            userBrn: contract.user.identifier.toString(),
            cityName: userAddressDetails.issuer?.name.toString(),
            cityCode: userAddressDetails.issuer?.code.toString(),
            streetCode: userAddressDetails.streetCode.toString(),
            streetName: userAddressDetails.streetName.toString(),
            streetNumber: userAddressDetails.streetNumber.toString(),
            zipCode: (userAddressDetails.zipCode || '').toString(),
            // END NOMINEE DETAILS
            // DOCUMENTS
            leaseOrRedirectionDocument: leaseContractFile.file.toString('base64'),
            powerOfAttorneyDocument: powerOfAttorneyFile.file.toString('base64'),
            infringementDocument: infringementFile.file.toString('base64'),
            // END DOCUMENTS
        });

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
            redirectionData.isDriver = 1;
            redirectionData.targetName = driverContract.driver.surname;
            redirectionData.targetSurname = driverContract.driver.name;
            redirectionData.cityName = driverAddressDetails.issuer?.name.toString();
            redirectionData.cityCode = driverAddressDetails.issuer?.code.toString();
            redirectionData.streetCode = driverAddressDetails.streetCode.toString();
            redirectionData.streetName = driverAddressDetails.streetName.toString();
            redirectionData.streetNumber = driverAddressDetails.streetNumber.toString();
            redirectionData.zipCode = (driverAddressDetails.zipCode || '').toString();
            redirectionData.userBrn = driverContract.driver.idNumber;
            redirectionData.licenseNumber=driverContract.driver.licenseNumber;

        }

        this.logger.debug({
            message: 'Redirection data for ATG',
            detail: omitUnreadable(redirectionData),
            fn: this.redirect.name,
        });

        /*
        // Validate the redirection data to ensure we have everything
        const validationErrors = await validate(redirectionData);
        if (validationErrors.length > 0) {
            socket.emit('municipal-redirection', { message: `Invalid redirection data, please contact support`, type: 'error' });
            this.logger.error({
                fn: this.redirect.name,
                detail: redirectionData,
                message: `The ATG data did not pass the validation rules`,
            });
            throw new InternalServerErrorException({
                message: ERROR_CODES.E079_InvalidRedirectionData.message(),
                detail: validationErrors,
            });
        }
*/
        //////////////////////////////////////////////////////////////////
        // Make the request
        //////////////////////////////////////////////////////////////////

        socket.emit('municipal-redirection', { message: 'Making a request to the municipality' });

        try {
            const response = await this.redirectionAutomationIntegration.redirectInfringement(redirectionData);

            socket.emit('municipal-redirection', { message: 'Made request' });
            this.logger.debug({ message: 'ATG Response', detail: response, fn: this.redirect.name });
        } catch (e) {
            socket.emit('municipal-redirection', {
                message: e.RcMessage,
                type: 'error',
            });
            this.logger.error({
                message: 'ATG Request failed',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.redirect.name,
            });
            throw new InternalServerErrorException({
                message: ERROR_CODES.E080_RedirectionFailed.message({ responseMessage: e.responseMessage }),
            });
        }

        return redirectionDocumentation.nomination;
    }
}
