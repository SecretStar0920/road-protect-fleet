import { BadRequestException, Injectable } from '@nestjs/common';
import { LinkDocumentParamDto } from '@modules/document/controllers/document.controller';
import { Logger } from '@logger';
import { Account, Contract, Document, Infringement, LeaseContract, Nomination } from '@entities';
import { isNil } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export enum DocumentLinkableTargets {
    Contract = 'contract',
    Account = 'account',
    Infringement = 'infringement',
    NominationFinal = 'nominationFinal',
    NominationRedirection = 'nominationRedirection',
    ContractRedirection = 'contractRedirection',
}
const DOCUMENT_LINKABLES = {
    [DocumentLinkableTargets.Contract]: {
        entity: Contract,
        id: 'contractId',
        key: 'document',
    },
    [DocumentLinkableTargets.ContractRedirection]: {
        entity: LeaseContract,
        id: 'contractId',
        key: 'redirectionDocument',
    },
    [DocumentLinkableTargets.Account]: {
        entity: Account,
        id: 'accountId',
        key: 'powerOfAttorney',
    },
    [DocumentLinkableTargets.Infringement]: {
        entity: Infringement,
        id: 'infringementId',
        key: 'document',
    },
    [DocumentLinkableTargets.NominationFinal]: {
        entity: Nomination,
        id: 'nominationId',
        key: 'mergedDocument',
    },
    [DocumentLinkableTargets.NominationRedirection]: {
        entity: Nomination,
        id: 'nominationId',
        key: 'redirectionDocument',
    },
};

@Injectable()
export class LinkDocumentService {
    constructor(private logger: Logger) {}

    async linkDocumentToEntity(dto: LinkDocumentParamDto): Promise<Document> {
        const { documentId, target, targetId } = dto;

        const document = await Document.createQueryBuilder('document').where('document.documentId = :documentId', { documentId }).getOne();

        if (isNil(document)) {
            throw new BadRequestException({ message: ERROR_CODES.E008_CouldNotFindDocumentToLink.message() });
        }

        this.logger.debug({ message: 'Found document to link', detail: null, fn: this.linkDocumentToEntity.name });

        const linkable = DOCUMENT_LINKABLES[target];
        const toLink = await linkable.entity.createQueryBuilder(target).where(`${target}.${linkable.id} = :id`, { id: targetId }).getOne();

        if (isNil(toLink)) {
            throw new BadRequestException(ERROR_CODES.E007_CouldNotFindTargetResourceToAddDocumentTo.message());
        }

        this.logger.debug({ message: 'Found entity to link', detail: toLink, fn: this.linkDocumentToEntity.name });
        toLink[linkable.key] = document;

        await toLink.save();

        this.logger.debug({ message: 'Set link: ', detail: linkable, fn: this.linkDocumentToEntity.name });

        return document;
    }
}
