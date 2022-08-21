import { BadRequestException, Injectable } from '@nestjs/common';
import { isNil, merge } from 'lodash';
import { Logger } from '@logger';
import { CONTRACT_CONSTRAINTS, Document, OwnershipContract } from '@entities';
import { UpdateContractService } from '@modules/contract/services/update-contract.service';
import { LinkingService } from '@modules/shared/services/linking.service';
import { UpdateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/controllers/update-ownership-contract.dto';
import * as moment from 'moment';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';

@Injectable()
export class UpdateOwnershipContractService extends UpdateContractService {
    constructor(protected logger: Logger, protected linkingService: LinkingService) {
        super(logger, linkingService);
    }

    async updateFromSpreadsheet(dto: UpdateOwnershipContractDto): Promise<OwnershipContract> {
        this.logger.log({ message: 'Updating Ownership Contract: ', detail: dto, fn: this.updateFromSpreadsheet.name });

        const ownershipContract = await OwnershipContract.createQueryBuilder('ownershipContract')
            .innerJoinAndSelect('ownershipContract.owner', 'owner')
            .andWhere('owner.identifier = :ownerIdentifier', { ownerIdentifier: dto.owner })
            .innerJoinAndSelect('ownershipContract.vehicle', 'vehicle')
            .andWhere('vehicle.registration = :registration', { registration: dto.vehicle })
            .getOne();

        if (isNil(ownershipContract)) {
            throw new BadRequestException({ message: `Could not find ownership contract to update` });
        }

        try {
            const updateObject: Partial<OwnershipContract> = {};
            if (dto.endDate) {
                updateObject.endDate = moment(dto.endDate).toISOString();
            }
            if (dto.startDate) {
                updateObject.startDate = dto.startDate;
            }
            if (dto.reference) {
                updateObject.reference = dto.reference;
            }
            if (dto.document) {
                updateObject.document = await Document.findByDocumentId(dto.document).getOne();
            }
            await OwnershipContract.update(ownershipContract.contractId, updateObject);
        } catch (e) {
            databaseExceptionHelper(e, CONTRACT_CONSTRAINTS, 'Failed to update ownership contract, please contact the developers.');
        }

        return ownershipContract;
    }

    async update(id: number, dto: UpdateOwnershipContractDto): Promise<OwnershipContract> {
        this.logger.log({ message: 'Updating Ownership Contract: ', detail: merge({ id }, dto), fn: this.update.name });
        const ownershipContract = await OwnershipContract.findById(id);
        if (dto.document) {
            await this.updateContractDocumentById(ownershipContract.contractId, {
                documentId: dto.document,
            });
        }
        if (dto.reference) {
            await this.updateContractReferenceById(
                ownershipContract.contractId,
                {
                    reference: dto.reference,
                },
                ownershipContract.owner.accountId,
            );
        }
        this.logger.log({
            message: 'Updated Ownership Contract: ',
            detail: {
                id,
                dto,
            },
            fn: this.update.name,
        });
        return await OwnershipContract.findById(id);
    }
}
