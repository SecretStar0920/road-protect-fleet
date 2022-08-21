import { Document, Infringement, Nomination, RedirectionType,LeaseContract } from '@entities';
import { Logger } from '@logger';
import { MergePdfDocumentService } from '@modules/document/services/merge-pdf-document.service';
import { CreateGeneratedDocumentService } from '@modules/generated-document/services/create-generated-document.service';
import { RenderGeneratedDocumentService } from '@modules/generated-document/services/render-generated-document.service';
import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { GetRedirectionDetailsService } from '@modules/nomination/services/get-redirection-details.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { get, isNil } from 'lodash';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { UpdateRedirectionStatusDto } from '@modules/nomination/dtos/update-redirection-status.dto';
import { MunicipalRedirectionParamDto } from '@modules/nomination/dtos/municipal-redirection-param.dto';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { MunicipalRedirectionEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { GetDocumentService } from '@modules/document/services/get-document.service';
import { DriverRedirectionService } from '@modules/nomination/services/redirection/driver-redirection.service';


export class GenerateRedirectionDocumentationResult {
    powerOfAttorneyDocument: Document;
    leaseContractDocument: Document; // Either the temporary (generated) lease contract or the real lease contract
    infringementRedirectionDocument: Document; // Automatically generated as of batch redireciton module
    mergedDocument: Document;
    nomination: Nomination;
}

@Injectable()
export class GenerateMunicipalRedirectionDocumentService {
    constructor(
        private logger: Logger,
        private getNominationReadinessService: GetRedirectionDetailsService,
        private mergePdfDocumentService: MergePdfDocumentService,
        private createGeneratedDocumentService: CreateGeneratedDocumentService,
        private generateGeneratedDocumentService: RenderGeneratedDocumentService,
        private emailService: EmailService,
        private getDocumentService: GetDocumentService,
        public driverRedirectionService: DriverRedirectionService,
    ) {}

    /**
     * Given a nomination, we generate the nomination document via merge and then return the updated nomination
     */
    @Transactional()
    async generateDocumentation(
        nominationId: number,
        redirectionDetails: MunicipalRedirectionDetails,
    ): Promise<GenerateRedirectionDocumentationResult> {
        this.logger.log({ message: 'Generating nomination documentation', detail: { nominationId }, fn: this.generateDocumentation.name });
        let nomination = await Nomination.findWithMinimalRelations()
            .where('nomination.nominationId = :nominationId', { nominationId })
            .getOne();
        if (isNil(nomination)) {
            throw new BadRequestException({ message: ERROR_CODES.E020_CouldNotFindNomination.message({ nominationId }) });
        }

        // 1. Get redirection readiness first
        // const redirectionDetails = await this.getNominationReadinessService.getRedirectionDetails(nomination.infringement.infringementId);
        if (!redirectionDetails.ready) {
            throw new BadRequestException({ message: ERROR_CODES.E082_NominationCannotBeMadeMissingDocuments.message() });
        }

        this.logger.debug({
            message: 'Nomination is ready to be generated',
            detail: { redirectionDetails },
            fn: this.generateDocumentation.name,
        });

        // 2. Get existing documents
        const powerOfAttorneyDocument = await Document.findPowerOfAttorneyByAccount(
            redirectionDetails.hasPowerOfAttorneyDocument.accountId,
        ).getOne();
        let leaseContractDocument = await Document.findByContract(redirectionDetails.hasLeaseDocument.contractId).getOne();
        const leaseContractSubstituteDocument = await Document.findLeaseContractSubstituteDocument(
            redirectionDetails.hasLeaseSubstituteDocument.contractId,
        ).getOne();
        leaseContractDocument = leaseContractDocument || leaseContractSubstituteDocument; // NB: Lease contract is substitutable by a generated document

        // 3. Automatically generate redirection document for the infringement
        const infringementRedirectionDocument = await this.generateRedirectionDocument(nomination);

        // NOTE: separated by type only to allow changes in the future if necessary
        if (redirectionDetails.type === RedirectionType.Manual || redirectionDetails.type === RedirectionType.Telaviv) {
            // NB: Infringement is ready for nomination if it has a PA and a lease contract
            // This is a double check to make sure the documents are actually retrieved
            if (isNil(powerOfAttorneyDocument) || isNil(leaseContractDocument)) {
                throw new InternalServerErrorException({ message: ERROR_CODES.E083_CouldNotRetrieveDocuments.message() });
            }
            this.logger.debug({ message: 'Found documents', detail: null, fn: this.generateDocumentation.name });

            // 4. Merge (ORDER MATTERS)
            const mergedDocument = await this.mergePdfDocumentService.mergeAndSave([
                infringementRedirectionDocument,
                leaseContractDocument,
                powerOfAttorneyDocument,
            ]);
            this.logger.debug({
                message: 'Merged documents',
                detail: { documentId: mergedDocument.documentId },
                fn: this.generateDocumentation.name,
            });

            // 5. Store document on nomination
            nomination.mergedDocument = mergedDocument;
            //nomination = await nomination.save();
            this.logger.debug({
                message: 'Updated nomination document',
                detail: nomination.mergedDocument,
                fn: this.generateDocumentation.name,
            });

            // 6. Return all the documents
            return {
                powerOfAttorneyDocument,
                leaseContractDocument,
                infringementRedirectionDocument,
                mergedDocument,
                nomination,
            };
        } else if (redirectionDetails.type === RedirectionType.ATG) {
            // NB: Infringement is ready for nomination if it has a PA and a lease contract
            // This is a double check to make sure the documents are actually retrieved
            if (isNil(powerOfAttorneyDocument) || isNil(leaseContractDocument)) {
                throw new InternalServerErrorException({ message: ERROR_CODES.E083_CouldNotRetrieveDocuments.message() });
            }
            this.logger.debug({ message: 'Found documents', detail: null, fn: this.generateDocumentation.name });

            // 4. Merge (ORDER MATTERS)
            const mergedDocument = await this.mergePdfDocumentService.mergeAndSave([
                infringementRedirectionDocument,
                leaseContractDocument,
                powerOfAttorneyDocument,
            ]);
            this.logger.debug({
                message: 'Merged documents',
                detail: { documentId: mergedDocument.documentId },
                fn: this.generateDocumentation.name,
            });

            // 5. Store document on nomination
            nomination.mergedDocument = mergedDocument;
            nomination = await nomination.save();
            this.logger.debug({
                message: 'Updated nomination document',
                detail: nomination.mergedDocument,
                fn: this.generateDocumentation.name,
            });

            // 6. Return all the documents
            return {
                powerOfAttorneyDocument,
                leaseContractDocument,
                infringementRedirectionDocument,
                mergedDocument,
                nomination,
            };
        } else if (
            redirectionDetails.type === RedirectionType.Jerusalem ||
            redirectionDetails.type === RedirectionType.Police ||
            redirectionDetails.type === RedirectionType.Mileon ||
            redirectionDetails.type === RedirectionType.Metropark
        ) {
            // NB: Infringement is ready for nomination if it has a PA and a lease contract
            // This is a double check to make sure the documents are actually retrieved
            if (isNil(powerOfAttorneyDocument) || isNil(leaseContractDocument)) {
                throw new InternalServerErrorException({ message: ERROR_CODES.E083_CouldNotRetrieveDocuments.message() });
            }
            this.logger.debug({ message: 'Found documents', detail: null, fn: this.generateDocumentation.name });

            // 4. Merge (ORDER MATTERS)
            const mergedDocument = await this.mergePdfDocumentService.mergeAndSave([
                infringementRedirectionDocument,
                powerOfAttorneyDocument,
                leaseContractDocument,
            ]);
            this.logger.debug({
                message: 'Merged documents',
                detail: { documentId: mergedDocument.documentId },
                fn: this.generateDocumentation.name,
            });

            // 5. Store document on nomination
            nomination.mergedDocument = mergedDocument;
            nomination = await nomination.save();
            this.logger.debug({
                message: 'Updated nomination document',
                detail: nomination.mergedDocument,
                fn: this.generateDocumentation.name,
            });

            // 6. Return all the documents
            return {
                powerOfAttorneyDocument,
                leaseContractDocument,
                infringementRedirectionDocument,
                mergedDocument,
                nomination,
            };
        }
    }


    @Transactional()
    async generateDocumentationOnly(
        nominationId: number,
    ): Promise<void> {
        this.logger.log({ message: 'Generating nomination documentation', detail: { nominationId }, fn: this.generateDocumentation.name });
        let nomination = await Nomination.findWithMinimalRelations()
            .where('nomination.nominationId = :nominationId', { nominationId })
            .getOne();
        if (isNil(nomination)) {
            throw new BadRequestException({ message: ERROR_CODES.E020_CouldNotFindNomination.message({ nominationId }) });
        }

        // 1. Get redirection readiness first
        let redirectionDetails = await this.getNominationReadinessService.getRedirectionDetails(nomination.infringement.infringementId);


        redirectionDetails.type=RedirectionType.Manual;
        this.logger.debug({
            message: 'Nomination is ready to be generated',
            detail: { redirectionDetails },
            fn: this.generateDocumentationOnly.name,
        });

        // 2. Get existing documents
        const powerOfAttorneyDocument = await Document.findPowerOfAttorneyByAccount(
            redirectionDetails.hasPowerOfAttorneyDocument.accountId,
        ).getOne();
        let leaseContractDocument = await Document.findByContract(redirectionDetails.hasLeaseDocument.contractId).getOne();
        const leaseContractSubstituteDocument = await Document.findLeaseContractSubstituteDocument(
            redirectionDetails.hasLeaseSubstituteDocument.contractId,
        ).getOne();
        leaseContractDocument = leaseContractDocument || leaseContractSubstituteDocument; // NB: Lease contract is substitutable by a generated document

        // 3. Automatically generate redirection document for the infringement
        const infringementRedirectionDocument = await this.generateRedirectionDocument(nomination);

        if (isNil(powerOfAttorneyDocument) || isNil(leaseContractDocument)) {
            throw new InternalServerErrorException({ message: ERROR_CODES.E083_CouldNotRetrieveDocuments.message() });
        }
        this.logger.debug({ message: 'Found documents', detail: null, fn: this.generateDocumentation.name });

        const mergedDocument = await this.mergePdfDocumentService.merge([
            infringementRedirectionDocument,
            leaseContractDocument,
            powerOfAttorneyDocument,
        ]);


        const contract = nomination.infringement.contract as LeaseContract;

        const emailTemplate: MunicipalRedirectionEmail = {
            name: '',
            issuerName: nomination.infringement.issuer.name,
            vehicleRegistration: nomination.infringement.vehicle.registration,
            noticeNumber: nomination.infringement.noticeNumber,
            ownerName: contract.owner.name,
            ownerIdentifier: contract.owner.identifier,
            targetName: contract.user.name,
            targetIdentifier: contract.user.identifier,
        };

        // Check for driver contract
        const driverContract = await this.driverRedirectionService.getDriverContract(nomination.infringement.infringementId);
        if (!!driverContract?.contractId) {
            emailTemplate.targetName = driverContract.driver.name + ' ' + driverContract.driver.surname;
            emailTemplate.targetIdentifier = driverContract.driver.licenseNumber;
        }
        try {
            await this.emailService.sendEmail({
                template: EmailTemplate.MunicipalRedirection,
                to: 'muni@roadprotect.co.il',
                from: 'muni@roadprotect.co.il',
                subject: ` מסמכי הסבה בלבד ללא שליחה לעירייה לקנס מספר${nomination.infringement.noticeNumber}`,
                context: emailTemplate,
                attachments: [
                    {
                        filename: `redirection-${nomination.infringement.noticeNumber}.pdf`,
                        content: Buffer.from(mergedDocument),
                    },
                ],
                lang: 'he',
            });
            this.logger.debug({
                message: `Mail sent to successfuly to - muni@roadprotect.co.il`,
                detail: nomination.mergedDocument,
                fn: this.generateDocumentationOnly.name,
            });
        } catch (e) {
            this.logger.debug({
                message: `Failed to send the email`,
                detail: { error: e },
                fn: this.generateDocumentationOnly.name,
            });
        }
    }


    // Requires a NEW TRANSACTION because the micro service requests for the result of this call for rendering
    @Transactional({ propagation: Propagation.NOT_SUPPORTED })
    private async generateCoverPage(nomination: Nomination) {
        let generatedDocument = await this.createGeneratedDocumentService.createGeneratedDocument({
            documentTemplateName: 'Infringement',
            infringementId: nomination.infringement.infringementId,
        });
        generatedDocument = await this.generateGeneratedDocumentService.renderGeneratedDocument(generatedDocument.generatedDocumentId);
        const infringementDocument = generatedDocument.document;
        return infringementDocument;
    }

    // Requires a NEW TRANSACTION because the micro service requests for the result of this call for rendering
    @Transactional({ propagation: Propagation.NOT_SUPPORTED })
    private async generateRedirectionDocument(nomination: Nomination) {
        let generatedDocument = await this.createGeneratedDocumentService.createGeneratedDocument({
            documentTemplateName: 'RedirectionV2',
            infringementId: get(nomination, 'infringement.infringementId'),
            contractId: get(nomination, 'infringement.contract.contractId'),
        });
        generatedDocument = await this.generateGeneratedDocumentService.renderGeneratedDocument(generatedDocument.generatedDocumentId);
        return generatedDocument.document;
    }
}
