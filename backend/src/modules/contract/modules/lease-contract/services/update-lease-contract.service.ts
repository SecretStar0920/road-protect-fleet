import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import {
    UpdateLeaseContractDto,
    UpdateLeaseContractMetadataDto,
} from '@modules/contract/modules/lease-contract/controllers/lease-contract.controller';
import { CONTRACT_CONSTRAINTS, Document, LeaseContract } from '@entities';
import { isNil, merge } from 'lodash';
import * as moment from 'moment';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { UpdateContractService } from '@modules/contract/services/update-contract.service';
import { LinkingService } from '@modules/shared/services/linking.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { ContractOcrStatusService } from '@modules/contract/services/contract-ocr-status.service';

@Injectable()
export class UpdateLeaseContractService extends UpdateContractService {
    constructor(
        protected logger: Logger,
        protected linkingService: LinkingService,
        private contractOcrStatusService: ContractOcrStatusService,
    ) {
        super(logger, linkingService);
    }

    async updateFromSpreadsheet(dto: UpdateLeaseContractDto): Promise<LeaseContract> {
        this.logger.log({ message: 'Updating Lease Contract: ', detail: dto, fn: this.updateFromSpreadsheet.name });

        const leaseContract = await LeaseContract.createQueryBuilder('leaseContract')
            .innerJoinAndSelect('leaseContract.user', 'user')
            .innerJoinAndSelect('leaseContract.owner', 'owner')
            .andWhere('leaseContract.startDate = :startDate::timestamptz', { startDate: moment(dto.startDate).toISOString() })
            .andWhere('user.identifier = :userIdentifier', { userIdentifier: dto.user })
            .andWhere('owner.identifier = :ownerIdentifier', { ownerIdentifier: dto.owner })
            .innerJoinAndSelect('leaseContract.vehicle', 'vehicle')
            .andWhere('vehicle.registration = :registration', { registration: dto.vehicle })
            .getOne();

        if (isNil(leaseContract)) {
            throw new BadRequestException({ message: ERROR_CODES.E042_NoLeaseContractToUpdate.message() });
        }

        // update end date
        try {
            const updateObject: Partial<LeaseContract> = {};
            updateObject.endDate = moment(dto.endDate).toISOString();
            if (dto.reference) {
                updateObject.reference = dto.reference;
            }
            if (dto.document) {
                updateObject.document = await Document.findByDocumentId(dto.document).getOne();
            }
            await LeaseContract.update(leaseContract.contractId, updateObject);
            // Check OCR status
            await this.contractOcrStatusService.setOcrStatus(leaseContract.contractId);
        } catch (e) {
            databaseExceptionHelper(e, CONTRACT_CONSTRAINTS, 'Failed to update lease contract, please contact the developers.');
        }

        return leaseContract;
    }

    async updateLeaseContractMetadata(id: number, dto: UpdateLeaseContractMetadataDto): Promise<LeaseContract> {
        this.logger.log({ message: 'Updating Lease Contract: ', detail: merge({ id }, dto), fn: this.updateLeaseContractMetadata.name });
        const leaseContract = await LeaseContract.findById(id);
        if (dto.document) {
            await this.updateContractDocumentById(leaseContract.contractId, {
                documentId: dto.document,
            });
            // Check OCR status
            await this.contractOcrStatusService.setOcrStatus(leaseContract.contractId);
        }
        if (dto.reference) {
            await this.updateContractReferenceById(
                leaseContract.contractId,
                {
                    reference: dto.reference,
                },
                leaseContract.owner.accountId,
            );
        }
        this.logger.log({
            message: 'Updated Lease Contract: ',
            detail: {
                id,
                dto,
            },
            fn: this.updateLeaseContractMetadata.name,
        });
        return await LeaseContract.findById(id);
    }
}
