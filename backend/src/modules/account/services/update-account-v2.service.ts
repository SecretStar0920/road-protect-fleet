import { Account, ACCOUNT_CONSTRAINTS, Document, Log, LogPriority, LogType } from '@entities';
import { Logger } from '@logger';
import { UpdateAccountV2Dto } from '@modules/account/controllers/update-account-v2-dto';
import { CreatePhysicalLocationDto, CreatePostalLocationDto } from '@modules/location/controllers/create-location-detailed.dto';
import { CreateLocationService } from '@modules/location/services/create-location.service';
import { UpdateLocationService } from '@modules/location/services/update-location.service';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { cloneDeep, isEmpty, isNil, merge, omit } from 'lodash';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
/**
 * NOTE: this service is in the process of deprecation
 * It is still in use by Spreadsheet upload and Taavura for creating accounts
 * The new API allows nested keys to be more specific about postal and physical address and is used by the frontend
 */
export class UpdateAccountV2Service {
    constructor(
        private logger: Logger,
        private updateLocationService: UpdateLocationService,
        private createLocationService: CreateLocationService,
    ) {}

    @Transactional()
    async updateAccount(id: number, dto: UpdateAccountV2Dto): Promise<Account> {
        this.logger.log({ message: 'Updating account: ', detail: merge({ id }, dto), fn: this.updateAccount.name });
        // Find
        let account = await Account.findWithMinimalRelations().where('account.accountId = :id', { id }).getOne();

        if (isNil(account)) {
            throw new BadRequestException({ message: ERROR_CODES.E026_CouldNotFindAccount.message({ accountId: id }) });
        }
        await this.preventIdentifierUpdates(dto, account);

        // Merge details
        account = merge(account, omit(dto, ['physicalLocation', 'postalLocation']));
        await this.updateAccountLocation(dto, account);
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
    async preventIdentifierUpdates(dto: UpdateAccountV2Dto, account: Account) {
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
    private async updateAccountLocation(dto: UpdateAccountV2Dto, account: Account) {
        if (dto.postalLocation) {
            this.logger.debug({ message: 'Updating Account Postal Address', fn: this.updateAccountLocation.name });
            // Guessing it's a postal update
            let postalAccountLocation = account.postalLocation;
            if (isEmpty(postalAccountLocation)) {
                this.logger.warn({
                    message: 'No existing Postal Location to update on the account, creating',
                    fn: this.updateAccountLocation.name,
                });
                // 1. Parse update DTO as a create DTO and validate
                const createPostalLocationDto = plainToClass(CreatePostalLocationDto, dto.postalLocation);
                const errors = await validate(createPostalLocationDto);
                if (errors.length <= 0) {
                    postalAccountLocation = await this.createLocationService.savePostalLocationV2(createPostalLocationDto);
                } else {
                    throw new BadRequestException({
                        message: ERROR_CODES.E065_InsufficientAddressInformationNoExistingPostal.message(),
                        detail: errors,
                    });
                }
            } else {
                postalAccountLocation = merge(postalAccountLocation, dto.postalLocation);
                await postalAccountLocation.save();
            }

            account.postalLocation = postalAccountLocation;
        }

        // Clean up postal location if no longer valid
        if (account.postalLocation) {
            const currentPostalLocation = plainToClass(CreatePostalLocationDto, account.postalLocation);
            const currentPostalLocationErrors = await validate(currentPostalLocation);
            if (currentPostalLocationErrors.length > 0) {
                // If no longer valid, delete postal location and set account postal location to null
                this.logger.debug({
                    message: 'Account Postal Address invalid, nullifying postal location',
                    fn: this.updateAccountLocation.name,
                });
                account.postalLocation = null;
            }
        }

        if (dto.physicalLocation) {
            this.logger.debug({ message: 'Updating Account Physical Address', fn: this.updateAccountLocation.name });
            // Guessing it's a physical update
            let physicalAccountLocation = cloneDeep(account.physicalLocation);
            if (isEmpty(physicalAccountLocation)) {
                this.logger.warn({
                    message: 'No existing Physical Location to update on the account, creating',
                    fn: this.updateAccountLocation.name,
                });
                // 1. Parse update DTO as a create DTO and validate
                const createPhysicalLocationDto = plainToClass(CreatePhysicalLocationDto, dto.physicalLocation);
                const errors = await validate(createPhysicalLocationDto);
                if (errors.length <= 0) {
                    physicalAccountLocation = await this.createLocationService.savePhysicalLocationV2(createPhysicalLocationDto);
                } else {
                    throw new BadRequestException({
                        message: ERROR_CODES.E066_InsufficientAddressInformationNoExistingPhysical.message(),
                        detail: errors,
                    });
                }
            } else {
                physicalAccountLocation = merge(physicalAccountLocation, dto.physicalLocation);
                physicalAccountLocation.hasGoogleResult = false;
                physicalAccountLocation.formattedAddress = null;
                await physicalAccountLocation.save();
            }

            account.physicalLocation = physicalAccountLocation;
        }
    }
}
