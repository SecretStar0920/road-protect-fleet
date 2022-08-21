import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DriverContract } from '@entities';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { Logger } from '@logger';
import { CreateDriverContractDto } from '@modules/contract/modules/driver-contract/controllers/create-driver-contract.dto';
import { UpdateDriverContractService } from '@modules/contract/modules/driver-contract/services/update-driver-contract.service';
import { GetDriverContractsService } from '@modules/contract/modules/driver-contract/services/get-driver-contracts.service';
import { FindExistingDriverContractService } from '@modules/contract/modules/driver-contract/services/find-existing-driver-contract.service';
import { CreateDriverContractService } from '@modules/contract/modules/driver-contract/services/create-driver-contract.service';
import { GetDriverContractService } from '@modules/contract/modules/driver-contract/services/get-driver-contract.service';

@Controller('driver-contract')
@UseGuards(UserAuthGuard)
export class DriverContractController {
    constructor(
        private getDriverContractService: GetDriverContractService,
        private getDriverContractsService: GetDriverContractsService,
        private createDriverContractService: CreateDriverContractService,
        private findExistingDriverContractService: FindExistingDriverContractService,
        private updateDriverContractService: UpdateDriverContractService,
        private logger: Logger,
    ) {}

    @Get(':contractId')
    async getDriverContract(@Param('contractId') contractId: number): Promise<DriverContract> {
        return await this.getDriverContractService.getDriverContract(contractId);
    }

    @Get()
    async getDriverContracts(): Promise<DriverContract[]> {
        return await this.getDriverContractsService.getDriverContracts();
    }

    @Post()
    async createDriverContract(@Body() dto: CreateDriverContractDto): Promise<DriverContract> {
        if (
            await FeatureFlagHelper.isEnabled({
                title: 'upsert-driver-contracts',
                defaultEnabled: true,
                disabledMessage: 'The ability to upsert driver contracts has been disabled',
            })
        ) {
            const found = await this.findExistingDriverContractService.find(dto.vehicle, dto.driver, dto.startDate, dto.endDate);
            if (found) {
                this.logger.warn({
                    message: `A user is trying to create an Driver contract that already exists`,
                    detail: dto,
                    fn: this.createDriverContract.name,
                });
                return await this.updateDriverContractService.update(found.contractId, {
                    document: dto.document,
                    reference: dto.reference,
                });
            }
        }
        return await this.createDriverContractService.createDriverContract(dto);
    }
}
