import { BadRequestException, Injectable } from '@nestjs/common';
import { isNil, merge } from 'lodash';
import { Logger } from '@logger';
import { Contract, CONTRACT_CONSTRAINTS, ContractOcrStatus, ContractStatus, ContractType, Document, LeaseContract } from '@entities';
import * as moment from 'moment';
import { LinkingService } from '@modules/shared/services/linking.service';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UpdateContractDocumentDto } from '@modules/contract/controllers/update-contract-document.dto';
import { UpdateContractReferenceDto } from '@modules/contract/controllers/update-contract-reference.dto';
import { UpdateContractEndDateDto } from '@modules/contract/controllers/update-contract-end-date.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class UpdateContractService {
    constructor(protected logger: Logger, protected linkingService: LinkingService) {}

    ////////////////////////////////////////////////////
    // Other
    ////////////////////////////////////////////////////

    async updateContractReferenceById(id: number, dto: UpdateContractReferenceDto, accountId: number): Promise<Contract> {
        this.logger.log({
            message: 'Updating Contract reference: ',
            detail: merge({ id }, dto),
            fn: this.updateContractReferenceById.name,
        });

        const contract = await Contract.findByIdAndAccountId(id, accountId).getOne();
        if (isNil(contract)) {
            throw new BadRequestException({ message: ERROR_CODES.E050_NoContractToUpdate.message() });
        }
        contract.reference = dto.reference;
        await contract.save();
        this.logger.log({ message: 'Updated Contract: ', detail: id, fn: this.updateContractReferenceById.name });
        return contract;
    }

    ////////////////////////////////////////////////////
    // Document
    ////////////////////////////////////////////////////

    async updateContractDocumentById(id: number, dto: UpdateContractDocumentDto): Promise<Contract> {
        this.logger.log({ message: 'Updating Vehicle Contract: ', detail: merge({ id }, dto), fn: this.updateContractDocumentById.name });

        let document: Document;
        if (dto.documentId) {
            document = await Document.findOne(dto.documentId);
            if (isNil(document)) {
                throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message({ documentId: dto.documentId }) });
            }
        }

        let contract = await Contract.findOne(id);
        if (isNil(contract)) {
            throw new BadRequestException({ message: ERROR_CODES.E050_NoContractToUpdate.message() });
        }
        contract = merge(contract, { document });
        await contract.save();
        this.logger.log({ message: 'Updated Contract: ', detail: id, fn: this.updateContractDocumentById.name });
        return contract;
    }

    ////////////////////////////////////////////////////
    // Dates
    ////////////////////////////////////////////////////

    @Transactional()
    async updateContractDatesById(id: number, dto: UpdateContractEndDateDto): Promise<Contract> {
        this.logger.log({ message: 'Updating Contract End Date: ', detail: merge({ id }, dto), fn: this.updateContractDatesById.name });

        // Find
        const contract = await Contract.findWithMinimalRelations().where('contract.contractId = :id', { id }).getOne();
        if (isNil(contract)) {
            throw new BadRequestException({ message: ERROR_CODES.E050_NoContractToUpdate.message({ contractId: id }) });
        }
        await this.updateContractDates(contract, dto);

        return contract;
    }

    async updateContractDatesByReferenceAndAccountId(
        reference: string,
        accountId: number,
        dto: UpdateContractEndDateDto,
    ): Promise<Contract> {
        this.logger.log({
            message: 'Updating Contract Document by contract reference: ',
            detail: { reference, accountId, ...dto },
            fn: this.updateContractDocumentById.name,
        });

        const [[contract], count] = await Contract.findByReferenceAndAccountId(reference, accountId).getManyAndCount();
        if (count > 1) {
            throw new BadRequestException({
                message: ERROR_CODES.E051_NonUniqueContractReference.message({ reference }),
            });
        } else if (count <= 0) {
            throw new BadRequestException({ message: ERROR_CODES.E052_NoContractFoundRelatingToAccount.message() });
        }

        await this.updateContractDates(contract, dto);

        return contract;
    }

    async updateContractDates(contract: Contract, dto: UpdateContractEndDateDto) {
        // Record old dates
        const oldStartDate = moment(contract.startDate).toISOString();
        const oldEndDate = moment(contract.endDate).toISOString();

        // Transform dates
        if (dto.endDate) {
            contract.endDate = moment(dto.endDate).toISOString();
            if (contract.type === ContractType.Lease && (contract as LeaseContract).ocrStatus === ContractOcrStatus.Success) {
                (contract as LeaseContract).ocrStatus = ContractOcrStatus.Modified;
            }
        }

        if (dto.startDate) {
            contract.startDate = moment(dto.startDate).toISOString();
        }

        // Update contract statuses
        if (moment().isAfter(dto.endDate)) {
            contract.status = ContractStatus.Expired;
        } else if (moment().isBefore(dto.startDate)) {
            contract.status = ContractStatus.Upcoming;
        } else {
            contract.status = ContractStatus.Valid;
        }

        try {
            contract = await contract.save();
        } catch (e) {
            databaseExceptionHelper(e, CONTRACT_CONSTRAINTS, 'Failed to update contract, please contact support');
        }

        const oldDates: UpdateContractEndDateDto = {
            startDate: oldStartDate,
            endDate: oldEndDate,
        };

        // Because the dates have changed we need to update the contracts that are linked and the nominations
        await this.linkingService.relinkContractInfringements(contract, oldDates);
    }
}
