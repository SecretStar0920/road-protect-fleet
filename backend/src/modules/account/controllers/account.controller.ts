import { NotApiGuard } from '@modules/auth/guards/not-api.guard';
import { Controller, Delete, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { GetAccountService } from '@modules/account/services/get-account.service';
import { GetAccountsService } from '@modules/account/services/get-accounts.service';
import { CreateAccountV1Service } from '@modules/account/services/create-account-v1.service';
import { UpdateAccountV1Service } from '@modules/account/services/update-account-v1.service';
import { DeleteAccountService } from '@modules/account/services/delete-account.service';
import { Account } from '@entities';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { isNil } from 'lodash';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { CreateAccountV1Dto } from '@modules/account/controllers/create-account-v1.dto';
import { UpdateAccountV1Dto } from '@modules/account/controllers/update-account-v1-dto';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AccountActionGuard } from '@modules/account/guards/account-action.guard';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';
import { CreateAccountV2Service } from '@modules/account/services/create-account-v2.service';
import { CreateAccountV2Dto } from '@modules/account/controllers/create-account-v2.dto';
import { UpdateAccountV2Service } from '@modules/account/services/update-account-v2.service';
import { UpdateAccountV2Dto } from '@modules/account/controllers/update-account-v2-dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { AccountReportNotificationService } from '@modules/account/services/account-report-notification.service';

@Controller('account')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Accounts')
export class AccountController {
    constructor(
        private getAccountService: GetAccountService,
        private getAccountsService: GetAccountsService,
        private createAccountV1Service: CreateAccountV1Service,
        private createAccountV2Service: CreateAccountV2Service,
        private updateAccountV1Service: UpdateAccountV1Service,
        private updateAccountV2Service: UpdateAccountV2Service,
        private deleteAccountService: DeleteAccountService,
        private accountReportingService: AccountReportNotificationService,
    ) {}

    @Get()
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getAccounts(): Promise<Account[]> {
        return this.getAccountsService.getAccounts();
    }

    @Get('emailreporting')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async sendReportingEmails(): Promise<any> {
        console.log('Reporting')
        return this.accountReportingService.sendReportToAllAccounts().then(() => {
            return { result: 'ok'}
        });
    }

    @Get('dropdown')
    @ApiOperation({ summary: 'Get short system account list' })
    async getAccountDropdownData(): Promise<Account[]> {
        return this.getAccountsService.getAccountDropdownData();
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current [logged in] account details' })
    @ApiResponse({ status: 403, description: ERROR_CODES.E057_MissingIdentityReLogin.message() })
    @ApiResponse({ status: 400, description: ERROR_CODES.E026_CouldNotFindAccount.message({ accountId: 'accountId' }) })
    async getCurrentAccount(@Identity() identity: IdentityDto): Promise<Account> {
        if (isNil(identity.accountId)) {
            throw new ForbiddenException(ERROR_CODES.E057_MissingIdentityReLogin.message());
        }
        return this.getAccountService.getAccount(identity.accountId, true);
    }

    @Get('me/all')
    @ApiExcludeEndpoint()
    async getCurrentUserAccounts(@Identity() identity: IdentityDto): Promise<Account[]> {
        if (isNil(identity.user)) {
            throw new ForbiddenException(ERROR_CODES.E057_MissingIdentityReLogin.message());
        }
        return this.getAccountService.getAccountsForUser(identity.user.userId);
    }

    @Get(':accountId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewProfile)
    @ApiOperation({ summary: 'Get an account by accountId' })
    async getAccount(@Param('accountId') accountId: number, @Identity() identity: IdentityDto, @UserSocket() socket): Promise<Account> {
        return this.getAccountService.getAccount(accountId, +identity.accountId === +accountId);
    }

    @Get('brn/:identifier')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewProfile)
    @ApiOperation({ summary: 'Get an account by identifier' })
    async getAccountByIdentifier(@Param('identifier') identifier: string): Promise<Account> {
        return this.getAccountService.getAccountByIdentifier(identifier);
    }

    @Post()
    @ApiOperation({
        summary: 'Create account [Deprecating - V1]',
        description:
            'Create an account on the system that represents a leasing company, vehicle user or hybrid account. We also need basic contact and address information',
    })
    @ApiResponse({ status: 400, description: ERROR_CODES.E117_NoValidLocationsProvided.message() })
    @ApiResponse({ status: 500, description: 'Database error. Failed to perform that action, please contact support.' })
    async createAccountV1(@Body() dto: CreateAccountV1Dto): Promise<Account> {
        return this.createAccountV1Service.createAccount(dto);
    }

    @Post('v2')
    @ApiOperation({
        summary: 'Create account [Phasing In - V2]',
        description:
            'Create an account on the system that represents a leasing company, vehicle user or hybrid account. We also need basic contact and address information',
    })
    @ApiResponse({ status: 400, description: ERROR_CODES.E117_NoValidLocationsProvided.message() })
    @ApiResponse({ status: 500, description: 'Database error. Failed to perform that action, please contact support.' })
    async createAccountV2(@Body() dto: CreateAccountV2Dto): Promise<Account> {
        return this.createAccountV2Service.createAccount(dto);
    }

    @Post(':accountId')
    @UseGuards(PermissionGuard, AccountActionGuard)
    @Permissions(PERMISSIONS.EditProfile)
    @ApiOperation({ summary: 'Update account by accountId [Deprecating - V1]', description: 'Update account information by accountId' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E026_CouldNotFindAccount.message({ accountId: 'accountId' }) })
    @ApiResponse({ status: 403, description: ERROR_CODES.E064_DisabledUpdateAccountBRN.message() })
    @ApiResponse({ status: 500, description: 'Failed to update account, please contact the developers.' })
    async updateAccountV1(
        @Param('accountId') accountId: number,
        @Body() dto: UpdateAccountV1Dto,
        @Identity() identity: IdentityDto,
    ): Promise<Account> {
        return this.updateAccountV1Service.updateAccount(accountId, dto);
    }

    @Post('v2/:accountId')
    @UseGuards(PermissionGuard, AccountActionGuard, NotApiGuard)
    @Permissions(PERMISSIONS.EditProfile)
    @ApiOperation({ summary: 'Update account by accountId [Phasing In - V2]', description: 'Update account information by accountId' })
    @ApiResponse({
        status: 400,
        description:
            ' * ' +
            ERROR_CODES.E026_CouldNotFindAccount.message({ accountId: 'accountId' }) +
            '\n * ' +
            ERROR_CODES.E065_InsufficientAddressInformationNoExistingPostal.message(),
    })
    @ApiResponse({ status: 403, description: ERROR_CODES.E064_DisabledUpdateAccountBRN.message() })
    @ApiResponse({ status: 500, description: 'Failed to update account, please contact the developers.' })
    async updateAccountV2(
        @Param('accountId') accountId: number,
        @Body() dto: UpdateAccountV2Dto,
        @Identity() identity: IdentityDto,
    ): Promise<Account> {
        return this.updateAccountV2Service.updateAccount(accountId, dto);
    }

    @Delete(':accountId')
    @UseGuards(PermissionGuard, AccountActionGuard)
    @Permissions(PERMISSIONS.DeleteProfile)
    @ApiExcludeEndpoint()
    async deleteAccount(@Param('accountId') accountId: number, @Identity() identity: IdentityDto): Promise<Account> {
        return this.deleteAccountService.deleteAccount(accountId);
    }

    @Delete(':accountId/soft')
    @UseGuards(PermissionGuard, AccountActionGuard)
    @Permissions(PERMISSIONS.DeleteProfile)
    @ApiExcludeEndpoint()
    async softDeleteAccount(@Param('accountId') accountId: number, @Identity() identity: IdentityDto): Promise<Account> {
        return this.deleteAccountService.softDeleteAccount(accountId);
    }
}
