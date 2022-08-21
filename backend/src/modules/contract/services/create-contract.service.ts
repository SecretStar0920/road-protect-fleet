import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, Document, Vehicle } from '@entities';
import { LinkingService } from '@modules/shared/services/linking.service';
import { isNil } from 'lodash';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class CreateContractService {
    constructor(protected logger: Logger, protected linkingService: LinkingService) {}

    @Transactional()
    async checkAccountRelations(accountIdentifier: string): Promise<Account> {
        let account: Account;
        if (accountIdentifier) {
            account = await Account.findByIdentifierOrId(accountIdentifier);
            if (isNil(account)) {
                throw new BadRequestException({
                    message: ERROR_CODES.E026_CouldNotFindAccount.message({ accountIdentifier }),
                    identifier: accountIdentifier,
                });
            }
        }
        return account;
    }

    @Transactional()
    async checkVehicleRelation(vehicle: number | string): Promise<Vehicle> {
        const foundVehicle = await Vehicle.findOneByRegistrationOrId(vehicle);
        if (!foundVehicle) {
            throw new BadRequestException({
                message: ERROR_CODES.E049_CouldNotFindVehicle.message({ registration: vehicle }),
                missingVehicle: vehicle,
            });
        }
        return foundVehicle;
    }

    @Transactional()
    async checkDocumentRelation(document: string | number) {
        // If null is provided, return null
        if (isNil(document)) {
            return;
        }
        // Else try find what was provided
        const foundDocument = await Document.findOne(document);
        // If invalid document identifier provided throw an error
        if (!foundDocument) {
            throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message(), document });
        }
        return foundDocument;
    }
}
