import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/get-ownership-contract.service';
import { GetOwnershipContractsService } from '@modules/contract/modules/ownership-contract/services/get-ownership-contracts.service';
import { CreateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract.service';
import { OwnershipContract } from '@entities';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { FindExistingOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/find-existing-ownership-contract.service';
import { Logger } from '@logger';
import { UpdateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/update-ownership-contract.service';
import { RateLimit, SetRateLimit } from '@modules/rate-limit/rate-limit.decorator';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { Config } from '@config/config';
import { CreateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/controllers/create-ownership-contract.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Controller('ownership-contract')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Ownership Contracts')
export class OwnershipContractController {
    constructor(
        private getOwnershipContractService: GetOwnershipContractService,
        private getOwnershipContractsService: GetOwnershipContractsService,
        private createOwnershipContractService: CreateOwnershipContractService,
        private findExistingOwnershipContractService: FindExistingOwnershipContractService,
        private updateOwnershipContractService: UpdateOwnershipContractService,
        private logger: Logger,
    ) {}

    @Get(':contractId')
    @ApiResponse({ status: 400, description: ERROR_CODES.E126_CouldNotFindContract.message({ contractId: 'contractId' }) })
    @ApiOperation({ summary: 'Get ownership contract by Id' })
    async getOwnershipContract(@Param('contractId') contractId: number): Promise<OwnershipContract> {
        return await this.getOwnershipContractService.getOwnershipContract(contractId);
    }

    @Get()
    @ApiOperation({ summary: 'Get ownership contracts' })
    @ApiExcludeEndpoint()
    async getOwnershipContracts(): Promise<OwnershipContract[]> {
        return await this.getOwnershipContractsService.getOwnershipContracts();
    }

    @Post()
    @ApiOperation({ summary: 'Create ownership contract' })
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
            ERROR_CODES.E050_NoContractToUpdate.message({ contractId: 'contractId' }) +
            '\n * ' +
            ERROR_CODES.E118_OwnerMustBeDefinedCreatingContract.message(),
    })
    @ApiResponse({ status: 500, description: 'Failed to create ownership contract, please contact the developers.' })
    @SetRateLimit(RateLimitActions.createOwnerContract, Config.get.rateLimit.actions.createOwnerContract)
    @RateLimit()
    async createOwnershipContract(@Body() dto: CreateOwnershipContractDto): Promise<OwnershipContract> {
        if (
            await FeatureFlagHelper.isEnabled({
                title: 'upsert-ownership-contracts',
                defaultEnabled: true,
                disabledMessage: 'The ability to upsert ownership contracts has been disabled',
            })
        ) {
            const found = await this.findExistingOwnershipContractService.find(dto.vehicle, dto.owner, dto.startDate, dto.endDate);
            if (found) {
                this.logger.warn({
                    message: `A user is trying to create an ownership contract that already exists`,
                    detail: dto,
                    fn: this.createOwnershipContract.name,
                });
                return await this.updateOwnershipContractService.update(found.contractId, {
                    document: dto.document,
                    reference: dto.reference,
                });
            }
        }
        return await this.createOwnershipContractService.createOwnershipContractAndLinkInfringements(dto);
    }
}
