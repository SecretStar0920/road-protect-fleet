import { BadRequestException, Injectable } from '@nestjs/common';
import {
    Account,
    ACCOUNT_CONSTRAINTS,
    AccountUser,
    AccountUserRole,
    Log,
    LogPriority,
    LogType,
    RawLocationParserHelper,
    Role,
    User,
} from '@entities';
import { Logger } from '@logger';
import { CreateAccountUserService } from '@modules/account-user/services/create-account-user.service';
import { plainToClass } from 'class-transformer';
import { CreateLocationService } from '@modules/location/services/create-location.service';
import { MetabaseEmbedService } from '@modules/metabase/services/metabase-embed.service';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { CreateAccountV1Dto } from '@modules/account/controllers/create-account-v1.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/controllers/create-location-detailed.dto';
import { merge } from 'lodash';
import { CreateAccountSpreadsheetDto } from '@modules/account/controllers/create-account-spreadsheet.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
/**
 * NOTE: this service is in the process of deprecation
 * It is still in use by Spreadsheet upload and Taavura for creating accounts
 * The new API allows nested keys to be more specific about postal and physical address and is used by the frontend
 */
export class CreateAccountV1Service {
    constructor(
        private logger: Logger,
        private createAccountUserService: CreateAccountUserService,
        private createLocationService: CreateLocationService,
        private metabaseEmbedService: MetabaseEmbedService,
    ) {}

    @Transactional()
    async createAccountFromSpreadsheet(dto: CreateAccountSpreadsheetDto): Promise<Account> {
        // Map the location dto
        const locationSingleDto: CreateLocationSingleDto = plainToClass(CreateLocationSingleDto, dto);
        const mappedLocationDto: CreateLocationDetailedDto = RawLocationParserHelper.parseCreateDto(locationSingleDto);
        const createAccountDto: CreateAccountV1Dto = merge(dto, mappedLocationDto);
        return this.createAccount(createAccountDto);
    }

    @Transactional()
    async createAccount(createAccountDto: CreateAccountV1Dto): Promise<Account> {
        this.logger.debug({ message: 'Creating account', detail: createAccountDto, fn: this.createAccount.name });
        // Create the account
        let account: Account = await Account.create(createAccountDto);
        // Nested details
        account.details = account.details || {};
        account.details.name = createAccountDto.contactName;
        account.details.telephone = createAccountDto.contactTelephone;
        account.details.fax = createAccountDto.contactFax;

        // 2. Also create the location
        await this.createLocations(createAccountDto, account);

        // 3. Save the account
        try {
            account = await Account.save(account);
            const initialAdminUsers = await this.addSystemAdmins(account);
            await AccountUser.save(initialAdminUsers);
        } catch (e) {
            databaseExceptionHelper(e, ACCOUNT_CONSTRAINTS, 'Failed to create account, please contact the developers.');
        }

        await this.metabaseEmbedService.updateAccountReportingEmbedUrl(account);
        await Log.createAndSave({ account, type: LogType.Created, message: 'Account', priority: LogPriority.High });
        this.logger.debug({ message: 'Created account', detail: account, fn: this.createAccount.name });

        return account;
    }

    private async createLocations(createAccountDto: CreateAccountV1Dto, account: Account) {
        const locations = await this.createLocationService.validateAndInferLocations(createAccountDto);
        if (locations.validations.Both.valid) {
            account.physicalLocation = await this.createLocationService.savePhysicalLocation(locations.dto);
            account.postalLocation = await this.createLocationService.savePostalLocation(locations.dto);
        } else if (locations.validations.Physical.valid) {
            account.physicalLocation = await this.createLocationService.savePhysicalLocation(locations.dto);
        } else if (locations.validations.Postal.valid) {
            account.postalLocation = await this.createLocationService.savePostalLocation(locations.dto);
        } else {
            throw new BadRequestException({
                message: ERROR_CODES.E117_NoValidLocationsProvided.message(),
                detail: locations.validations,
            });
        }
    }

    /**
     * Super admins are automatically added to the account as 'hidden' users
     */
    @Transactional()
    private async addSystemAdmins(account: Account): Promise<AccountUser[]> {
        this.logger.debug({ message: 'Adding default system admins to account', detail: account.name, fn: this.addSystemAdmins.name });
        const admins = await User.getAdmins();
        this.logger.debug({ message: 'Admins: ', detail: admins.map((admin) => admin.email), fn: this.addSystemAdmins.name });
        const role = await Role.findOne({ name: 'System Administrator' });
        const accountUsers = await this.createAccountUserService.createManyFromExisting(admins, account, {
            hidden: true,
            roles: [AccountUserRole.create({ role })],
        });
        this.logger.debug({ message: 'Admin Users: ', detail: accountUsers.length, fn: this.addSystemAdmins.name });
        return accountUsers;
    }
}
