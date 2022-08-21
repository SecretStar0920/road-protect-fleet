import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetContractService } from '@modules/contract/services/get-contract.service';
import { GetContractsService } from '@modules/contract/services/get-contracts.service';
import { CreateContractService } from '@modules/contract/services/create-contract.service';
import { UpdateContractService } from '@modules/contract/services/update-contract.service';
import { DeleteContractService } from '@modules/contract/services/delete-contract.service';
import { Contract } from '@entities';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { BatchUpdateContractDocumentService } from '@modules/contract/services/batch-update-contract-document.service';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { UpdateContractDocumentDto } from '@modules/contract/controllers/update-contract-document.dto';
import { UpdateContractReferenceDto } from '@modules/contract/controllers/update-contract-reference.dto';
import { UpdateContractEndDateDto } from '@modules/contract/controllers/update-contract-end-date.dto';
import { FixContractService } from '@modules/contract/services/fix-contract.service';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { Express } from 'express';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Controller('contract')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Contracts')
export class ContractController {
    constructor(
        private getContractService: GetContractService,
        private getContractsService: GetContractsService,
        private createContractService: CreateContractService,
        private updateContractService: UpdateContractService,
        private deleteContractService: DeleteContractService,
        private batchUpdateContractDocumentService: BatchUpdateContractDocumentService,
        private fixContractService: FixContractService,
        private antivirusService: AntivirusService,
    ) {}

    @Get('fix-dates')
    @ApiExcludeEndpoint()
    async fixContractDates() {
        return this.fixContractService.fixDates();
    }

    @Get(':contractId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewVehicle)
    @ApiOperation({ summary: 'Get contract (either lease / ownership) by contractId' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E126_CouldNotFindContract.message({ contractId: 'contractId' }) })
    async getContract(@Param('contractId') contractId: number): Promise<Contract> {
        return this.getContractService.getContract(contractId);
    }

    @Get()
    @UseGuards(SystemAdminGuard, PermissionGuard)
    @Permissions(PERMISSIONS.ViewVehicle)
    @ApiExcludeEndpoint()
    async getContracts(): Promise<Contract[]> {
        return this.getContractsService.getContracts();
    }

    @Get('vehicle/:vehicleId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewVehicles)
    @ApiOperation({ summary: 'Get contracts for a vehicle by vehicleId' })
    async getContractsForVehicle(@Param('vehicleId') vehicleId: number): Promise<Contract[]> {
        return this.getContractsService.getContractsForVehicle(vehicleId);
    }

    @Post(':contractId/document')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
    //  @ApiOperation({ summary: 'Update contract document' })
    @ApiExcludeEndpoint()
    async updateContractDocument(@Param('contractId') contractId: number, @Body() dto: UpdateContractDocumentDto): Promise<Contract> {
        return this.updateContractService.updateContractDocumentById(contractId, dto);
    }

    @Post(':contractId/end-date')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
    @ApiOperation({ summary: 'Update contract end date' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E050_NoContractToUpdate.message({ contractId: 'contractId' }) })
    @ApiResponse({ status: 500, description: 'Failed to update contract, please contact support' })
    async updateContractEndDate(@Param('contractId') contractId: number, @Body() dto: UpdateContractEndDateDto): Promise<Contract> {
        return this.updateContractService.updateContractDatesById(contractId, dto);
    }

    @Post('reference/:reference/end-date')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
    @ApiOperation({ summary: 'Update contract end date by reference' })
    @ApiResponse({
        status: 400,
        description:
            ' * ' +
            ERROR_CODES.E051_NonUniqueContractReference.message({ reference: 'reference' }) +
            '\n * ' +
            ERROR_CODES.E052_NoContractFoundRelatingToAccount.message(),
    })
    @ApiResponse({ status: 500, description: 'Failed to update contract, please contact support' })
    async updateContractEndDateByReference(
        @Param('reference') reference: string,
        @Body() dto: UpdateContractEndDateDto,
        @Identity() identity: IdentityDto,
    ): Promise<Contract> {
        return this.updateContractService.updateContractDatesByReferenceAndAccountId(reference, identity.accountId, dto);
    }

    @Post(':contractId/reference')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
    @ApiOperation({
        summary: 'Update contract reference by contractId',
        description: 'Your account has to be on the contract you are editing',
    })
    @ApiResponse({ status: 400, description: ERROR_CODES.E050_NoContractToUpdate.message({ contractId: 'contractId' }) })
    async updateContractReferenceById(
        @Param('contractId') contractId: number,
        @Body() dto: UpdateContractReferenceDto,
        @Identity() identity: IdentityDto,
    ): Promise<Contract> {
        return this.updateContractService.updateContractReferenceById(contractId, dto, identity.accountId);
    }

    @Delete(':contractId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.DeleteVehicles)
    @ApiOperation({ summary: 'Delete contract by contractId' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E035_CouldNotFindContractToDelete.message() })
    async deleteContract(@Param('contractId') contractId: number): Promise<Contract> {
        return this.deleteContractService.deleteContract(contractId);
    }

    @Post('contract-documents/:overwriteFile')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
    // @ApiOperation({
    //     summary: 'Batch upload PDF documents for contracts by Reference',
    //     description: 'The file must be a zip file containing all the documents named by reference',
    // })
    @ApiExcludeEndpoint()
    @UseInterceptors(FileInterceptor('file'))
    async batchUpdateContractDocuments(@UploadedFile() file: Express.Multer.File, @Param('overwriteFile') overwriteFile?: boolean) {
        await this.antivirusService.scanBuffer(file.buffer);
        return this.batchUpdateContractDocumentService.batchUpdateContractDocuments(file, overwriteFile);
    }

    @Post('generate-lease-contract-documents')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async requestInformation(@Body() body: { contractIds: number[]; representativeDetails: string }) {
        return await this.batchUpdateContractDocumentService.batchGenerateContractDocuments(body.contractIds, body.representativeDetails);
    }
}
