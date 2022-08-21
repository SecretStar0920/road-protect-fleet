import { Body, Controller, Delete, forwardRef, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { GetLeaseContractsService } from '@modules/contract/modules/lease-contract/services/get-lease-contracts.service';
import { GetLeaseContractService } from '@modules/contract/modules/lease-contract/services/get-lease-contract.service';
import { LeaseContract } from '@entities';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { asString, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';
import * as moment from 'moment';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { DeleteAccountLeaseContractsDto } from '@modules/contract/modules/lease-contract/controllers/delete-account-lease-contracts.dto';
import { DeleteLeaseContractService } from '@modules/contract/modules/lease-contract/services/delete-lease-contract.service';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { RateLimit, SetRateLimit } from '@modules/rate-limit/rate-limit.decorator';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { Config } from '@config/config';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

/**
 * This is for smaller updates to the lease contract, it allows us to limit the
 * extent at which we're changing the contract itself.
 */
export class UpdateLeaseContractMetadataDto {
    @IsOptional()
    @ApiProperty({
        description: 'An optional reference Id for linking to batch file upload or your system Id',
        required: false,
        example: 'Doc123471',
    })
    reference?: string;

    @IsOptional()
    @ApiProperty({ description: 'The lease contract documentId', required: false, example: 1 })
    document?: number;
}

export class UpdateLeaseContractDto {
    @IsString()
    @ApiProperty({ description: 'The lease contract start date', required: true, example: moment().toISOString() })
    @FixDate()
    startDate: string;
    @IsString()
    @ApiProperty({
        description: 'The lease contract end date',
        required: false,
        example: moment().add('2', 'weeks').toISOString(),
    })
    @FixDate()
    endDate?: string;
    @IsDefined()
    @ApiProperty({ description: 'The lease contract user BRN', example: '37283819237' })
    user: string;
    @IsDefined()
    @ApiProperty({ description: 'The lease contract owner BRN', example: '57283819237' })
    owner: string;
    @IsDefined()
    @Transform((val) => vehicleRegistrationFormat(asString(val)))
    @ApiProperty({ description: 'The lease contract vehicle registration', required: true, example: '37178283' })
    vehicle: string;
    @IsOptional()
    @ApiProperty({
        description: 'An optional reference Id for linking to batch file upload or your system Id',
        required: false,
        example: 'Doc123471',
    })
    reference?: string;

    @IsOptional()
    @ApiProperty({ description: 'The lease contract documentId', required: false, example: 1 })
    document?: number;

    @IsOptional()
    @IsString()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;
}

export class CreateLeaseContractDto {
    @ApiProperty({ description: 'The lease contract start date', example: moment().toISOString() })
    @FixDate()
    @IsString()
    startDate: string;

    @IsOptional()
    @ApiProperty({
        description: 'The lease contract end date',
        required: false,
        example: moment().add(2, 'weeks').toISOString(),
    })
    @FixDate()
    @IsString()
    endDate?: string;
    @IsDefined()
    @ApiProperty({ description: 'The lease contract user BRN', example: '37283819237' })
    user: string;
    @IsDefined()
    @ApiProperty({ description: 'The lease contract owner BRN', example: '57283819237' })
    owner: string;
    @IsDefined()
    @ApiProperty({ description: 'The lease contract vehicle registration', example: '37178283' })
    @Transform((val) => vehicleRegistrationFormat(asString(val)))
    vehicle: string;
    @IsOptional()
    @ApiProperty({ description: 'The lease contract documentId', required: false, example: 1 })
    document?: number;
    @IsOptional()
    @ApiProperty({
        description: 'An optional reference Id for linking to batch file upload or your system Id',
        required: false,
        example: 'Doc123471',
    })
    reference?: string;
    @IsOptional()
    @IsString()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;
}

@Controller('lease-contract')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Lease Contracts')
export class LeaseContractController {
    constructor(
        private getLeaseContractService: GetLeaseContractService,
        private getLeaseContractsService: GetLeaseContractsService,
        @Inject(forwardRef(() => CreateLeaseContractService))
        private createLeaseContractService: CreateLeaseContractService,
        private deleteLeaseContractService: DeleteLeaseContractService,
    ) {}

    @Get(':contractId')
    @ApiOperation({ summary: 'Get lease contract' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E126_CouldNotFindContract.message({ contractId: 'contractId' }) })
    async getLeaseContract(@Param('contractId') contractId: number): Promise<LeaseContract> {
        return await this.getLeaseContractService.getLeaseContract(contractId);
    }

    @Get()
    @ApiOperation({ summary: 'Get lease contracts' })
    @ApiExcludeEndpoint()
    @UseGuards(SystemAdminGuard)
    async getLeaseContracts(): Promise<LeaseContract[]> {
        return await this.getLeaseContractsService.getLeaseContracts();
    }

    @Post()
    @ApiOperation({ summary: 'Create lease contract' })
    @SetRateLimit(RateLimitActions.createLeaseContract, Config.get.rateLimit.actions.createLeaseContract)
    @ApiResponse({
        status: 400,
        description:
            ' * ' +
            ERROR_CODES.E026_CouldNotFindAccount.message({ accountIdentifier: 'accountIdentifier' }) +
            '\n * ' +
            ERROR_CODES.E038_ProvidedDatesOverlapWithExistingContract.message() +
            '\n * ' +
            ERROR_CODES.E044_CouldNotFindDocument.message({ documentId: 'documentId' }) +
            '\n * ' +
            ERROR_CODES.E049_CouldNotFindVehicle.message({ registration: 'registration' }) +
            '\n * ' +
            ERROR_CODES.E050_NoContractToUpdate.message({ contractId: 'contractId' }),
    })
    @ApiResponse({ status: 500, description: 'Failed to create lease contract, please contact the developers.' })
    @RateLimit()
    async createLeaseContract(@Body() dto: CreateLeaseContractDto): Promise<LeaseContract> {
        if (
            await FeatureFlagHelper.isEnabled({
                title: 'upsert-lease-contracts',
                defaultEnabled: true,
                disabledMessage: 'The ability to upsert lease agreements has been disabled',
            })
        ) {
            return await this.createLeaseContractService.upsertContractAndLinkInfringements(dto);
        }
        return await this.createLeaseContractService.createContractAndLinkInfringements(dto);
    }

    @Delete('account/:accountId')
    @ApiOperation({ summary: 'Bulk delete OWNED lease contracts by account id' })
    @ApiExcludeEndpoint()
    @UseGuards(SystemAdminGuard)
    async bulkDeleteOwnedLeasesByAccount(@Body() dto: DeleteAccountLeaseContractsDto, @Param('accountId') accountId: number) {
        return await this.deleteLeaseContractService.deleteByAccountId(accountId, dto.excludeIds || [], true);
    }
}
