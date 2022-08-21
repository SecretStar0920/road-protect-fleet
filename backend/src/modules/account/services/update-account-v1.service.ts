import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Account, ACCOUNT_CONSTRAINTS, Document, Log, LogPriority, LogType } from '@entities';
import { cloneDeep, isEmpty, isNil, merge } from 'lodash';
import { Logger } from '@logger';
import { plainToClass } from 'class-transformer';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { UpdateAccountV1Dto } from '@modules/account/controllers/update-account-v1-dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UpdateLocationDetailedDto } from '@modules/location/controllers/update-location-detailed-dto';
import { UpdateLocationService } from '@modules/location/services/update-location.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class UpdateAccountV1Service {
    constructor(private logger: Logger, private updateLocationService: UpdateLocationService) {}

    @Transactional()
    async updateAccount(id: number, dto: UpdateAccountV1Dto): Promise<Account> {
        this.logger.log({ message: 'Updating account: ', detail: merge({ id }, dto), fn: this.updateAccount.name });
        // Find
        let account = await Account.findWithMinimalRelations().where('account.accountId = :id', { id }).getOne();

        if (isNil(account)) {
            throw new BadRequestException({ message: ERROR_CODES.E026_CouldNotFindAccount.message({ accountId: id }) });
        }
        await this.preventIdentifierUpdates(dto, account);

        // Merge details
        account = merge(account, dto);
        account.details = account.details || {};
        if (dto.contactName) account.details.name = dto.contactName;
        if (dto.contactTelephone) account.details.telephone = dto.contactTelephone;
        if (dto.contactFax) account.details.fax = dto.contactFax;

        /**
         * Preventing address updates for this service function (used by Taavura)
         */
        // await this.updateAccountLocation(dto, account);
        try {
            if (dto.documentId) {
                // Try update the Power of Attorney
                const document = await Document.findOne(dto.documentId);
                if (document) {
                    account.powerOfAttorney = document;
                }
            }
            // Save account
            await account.save();
        } catch (e) {
            databaseExceptionHelper(e, ACCOUNT_CONSTRAINTS, 'Failed to update account, please contact the developers.');
        }
        await Log.createAndSave({ account, type: LogType.Updated, message: 'Account', priority: LogPriority.High });
        this.logger.log({ message: 'Updated account: ', detail: id, fn: this.updateAccount.name });
        return Account.findWithMinimalRelations().where('account.accountId = :id', { id }).getOne();
    }

    /**
     * Preventing identifier updates temporarily
     */
    async preventIdentifierUpdates(dto: UpdateAccountV1Dto, account: Account) {
        if (dto.identifier) {
            if (account.identifier !== dto.identifier) {
                throw new ForbiddenException({
                    message: ERROR_CODES.E064_DisabledUpdateAccountBRN.message(),
                    detail: {
                        previousIdentifier: account.identifier,
                        updateIdentifier: dto.identifier,
                    },
                });
            }
        }
    }

    @Transactional()
    private async updateAccountLocation(dto: UpdateAccountV1Dto, account: Account) {
        const locationDto = plainToClass(UpdateLocationDetailedDto, dto);

        if (locationDto.postOfficeBox) {
            this.logger.debug({ message: 'Updating Account Postal Address', fn: this.updateAccountLocation.name });
            // Guessing it's a postal update
            let postalAccountLocation = cloneDeep(account.postalLocation);
            if (!postalAccountLocation) {
                this.logger.warn({ message: 'No existing Postal Location to update on the account', fn: this.updateAccountLocation.name });
            } else {
                if (!isEmpty(locationDto)) {
                    postalAccountLocation = merge(postalAccountLocation, locationDto);
                    await postalAccountLocation.save();
                    account.postalLocation = postalAccountLocation;
                }
                return postalAccountLocation;
            }
        } else {
            this.logger.debug({ message: 'Updating Account Physical Address', fn: this.updateAccountLocation.name });
            let physicalAccountLocation = cloneDeep(account.physicalLocation);
            if (!physicalAccountLocation) {
                this.logger.warn({
                    message: 'No existing Physical Location to update on the account',
                    fn: this.updateAccountLocation.name,
                });
            } else {
                if (!isEmpty(locationDto)) {
                    physicalAccountLocation = merge(physicalAccountLocation, locationDto);
                    physicalAccountLocation.hasGoogleResult = false;
                    physicalAccountLocation.formattedAddress = null;
                    await physicalAccountLocation.save();
                    account.physicalLocation = physicalAccountLocation;
                }
                return physicalAccountLocation;
            }
        }
    }
}
