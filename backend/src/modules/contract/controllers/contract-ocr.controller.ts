import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { RawContractOcrDto } from '@integrations/contract/raw-contract-ocr.dto';
import { ContractOcrIntegration } from '@integrations/contract/contract-ocr.integration';
import { Logger } from '@logger';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { Express } from 'express';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { ContractOcrStatusService } from '@modules/contract/services/contract-ocr-status.service';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { BulkContractOcrDto } from '@modules/contract/controllers/bulk-contract-ocr.dto';

@Controller('contract/ocr')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Contracts')
export class ContractOcrController {
    private logger = Logger.instance;
    constructor(
        private contractOcrIntegration: ContractOcrIntegration,
        private antivirusService: AntivirusService,
        private contractOcrStatusService: ContractOcrStatusService,
    ) {}

    @Post('/file')
    @UseInterceptors(FilesInterceptor('files'))
    @ApiOperation({ summary: 'Create document and perform OCR' })
    @ApiResponse({
        status: 400,
        description: ' * ' + ERROR_CODES.E025_ErrorFromContractOCR.message() + '\n * ' + ERROR_CODES.E041_NoFileUploadedToOCR.message(),
    })
    @ApiResponse({ status: 500, description: `Malicious file detected!` })
    @ApiConsumes('multipart/form-data')
    async ocrByFile(@UploadedFiles() files: Express.Multer.File[]): Promise<RawContractOcrDto[]> {
        await Promise.all(files.map((file) => this.antivirusService.scanBuffer(file.buffer)));
        this.logger.debug({ message: 'Received OCR request', fn: this.ocrByFile.name });
        if (!files) {
            this.logger.debug({ message: 'Received OCR request', detail: files, fn: this.ocrByFile.name });
            throw new BadRequestException({ message: ERROR_CODES.E041_NoFileUploadedToOCR.message() });
        }
        const responses: RawContractOcrDto[] = [];
        for (const file of files) {
            const response = await this.contractOcrIntegration.retrieveContractOCR(file);
            responses.push(response);
        }
        return responses;
    }

    @Get('/:contractId')
    @ApiExcludeEndpoint()
    async updateContractOcrStatus(@Param('contractId') contractId: number) {
        return await this.contractOcrStatusService.setOcrStatus(contractId);
    }

    @Get('/run/:contractId')
    @ApiExcludeEndpoint()
    async runOcrByContractId(@Param('contractId') contractId: number) {
        return await this.contractOcrStatusService.runOcrByContractId(contractId);
    }

    @Post('/run/bulk')
    @ApiOperation({ summary: 'Batch contract ocr' })
    async bulkRunOcrByContractId(@Body() dto: BulkContractOcrDto, @Identity() identity: IdentityDto) {
        return await this.contractOcrStatusService.bulkRunOcrByContractId(dto);
    }

    @Get('/correct-status')
    @ApiExcludeEndpoint()
    async fixOcrStatuses() {
        return await this.contractOcrStatusService.fixOcrStatuses();
    }
}
