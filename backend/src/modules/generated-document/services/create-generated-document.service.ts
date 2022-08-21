import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGeneratedDocumentDto } from '@modules/generated-document/controllers/generated-document.controller';
import { Logger } from '@logger';
import {
    Account,
    Contract,
    DocumentTemplate,
    DocumentTemplateFieldTypes,
    DocumentTemplateForm,
    GeneratedDocument,
    Infringement,
} from '@entities';
import { forEach, get, isNil } from 'lodash';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import * as moment from 'moment';
import { Config } from '@config/config';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class CreateGeneratedDocumentService {
    constructor(private logger: Logger) {}

    @Transactional()
    async createGeneratedDocument(dto: CreateGeneratedDocumentDto): Promise<GeneratedDocument> {
        this.logger.debug({ message: 'Creating Generated Document', detail: dto, fn: this.createGeneratedDocument.name });
        let generatedDocument: GeneratedDocument;
        try {
            const created = await this.createOnly(dto);
            generatedDocument = await created.save();
        } catch (e) {
            throw new InternalServerErrorException({ message: ERROR_CODES.E046_FailedToCreateGeneratedDocument.message(), e });
        }
        this.logger.debug({
            message: 'Saved GeneratedDocument',
            detail: generatedDocument.generatedDocumentId,
            fn: this.createGeneratedDocument.name,
        });
        return generatedDocument;
    }

    async setRepresentativeDetails(generatedDocument: GeneratedDocument, representativeDetails: string): Promise<GeneratedDocument> {
        if (generatedDocument.form.fields.ownerNamePosition) {
            generatedDocument.form.fields.ownerNamePosition.value = representativeDetails;
            this.logger.debug({
                message: 'Setting the ownerNamePosition of the account representative',
                detail: { details: generatedDocument.form.fields.ownerNamePosition, representativeDetails },
                fn: this.setRepresentativeDetails.name,
            });
        }
        return await generatedDocument.save();
    }

    @Transactional()
    async createOnly(dto: CreateGeneratedDocumentDto): Promise<GeneratedDocument> {
        const template: DocumentTemplate = await DocumentTemplate.findByName(dto.documentTemplateName).getOne();

        if (isNil(template)) {
            throw new BadRequestException({ message: ERROR_CODES.E015_CouldNotFindDocumentTemplate.message() });
        }

        const account: Account = await Account.findWithMinimalRelations()
            .addSelect('account.fleetManagerDetails')
            .andWhere('account.accountId = :accountId', { accountId: dto.accountId })
            .getOne();

        const contract: Contract = await Contract.findWithMinimalRelations()
            .addSelect('owner.fleetManagerDetails')
            .leftJoinAndSelect('owner.physicalLocation', 'owner_location')
            .leftJoinAndSelect('owner.postalLocation', 'owner_postal_location')
            .leftJoinAndSelect('user.physicalLocation', 'user_location')
            .leftJoinAndSelect('user.postalLocation', 'user_postal_location')
            .where('contract.contractId = :contractId', { contractId: dto.contractId })
            .getOne();

        const infringement: Infringement = await Infringement.findWithMinimalRelations()
            .where('infringement.infringementId = :infringementId', { infringementId: dto.infringementId })
            .getOne();

        const form = await this.autoFillTemplateForm(template.form, account, contract, infringement);

        return GeneratedDocument.create({
            documentTemplate: template,
            form,
        });
    }

    /**
     * TODO: auto fill form based on the relations
     */
    async autoFillTemplateForm(form: DocumentTemplateForm, account: Account, contract: Contract, infringement: Infringement) {
        this.logger.debug({ message: 'Auto-filling form', detail: null, fn: this.autoFillTemplateForm.name });
        forEach(form.fields, (val, key) => {
            const autofill = val.autofill;
            if (autofill.enabled) {
                this.logger.debug({ message: 'Auto-filling form field', detail: { key }, fn: this.autoFillTemplateForm.name });
                let baseData = {};
                switch (autofill.fromBaseEntity) {
                    case 'account':
                        baseData = account;
                        break;
                    case 'contract':
                        baseData = contract;
                        // !NB! If fleetManager details aren't found, assume Power of Attorney is provided
                        // and allow autofill with FleetManager details (This is specific to the redirection template document)
                        if (!isNil(contract) && isNil(get(contract, 'owner.fleetManagerDetails', undefined))) {
                            contract.owner.fleetManagerDetails = Config.get.systemSignature.Ore;
                        }
                        break;
                    case 'infringement':
                        baseData = infringement;
                        break;
                    default:
                        this.logger.error({ message: 'Unhandled autofill base entity', fn: this.autoFillTemplateForm.name });
                        break;
                }

                let value = get(baseData, autofill.withPath, undefined);

                if (val.type === DocumentTemplateFieldTypes.Date) {
                    if (moment(value).isValid()) {
                        value = moment(value).format('HH:mm DD/MM/YYYY');
                    }
                }

                val.value = value;
                if (isNil(val.value)) {
                    this.logger.warn({
                        message: 'Autofill contract field failed',
                        detail: { autofill, data: baseData },
                        fn: this.autoFillTemplateForm.name,
                    });
                }
            }
        });

        return form;
    }
}
