import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    forwardRef,
    Get,
    Inject,
    Param,
    Post,
    Res,
    UploadedFile, UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { GetDocumentService } from '@modules/document/services/get-document.service';
import { GetDocumentsService } from '@modules/document/services/get-documents.service';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { UpdateDocumentService } from '@modules/document/services/update-document.service';
import { Document } from '@entities';
import { IsDefined, IsIn, IsOptional, IsString, IsUUID, validate, ValidateNested } from 'class-validator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExcludeEndpoint, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { DocumentLinkableTargets, LinkDocumentService } from '@modules/document/services/link-document.service';
import { DeleteDocumentService } from '@modules/document/services/delete-document.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { safeParse } from '@modules/shared/helpers/safe-parse';
import { OcrDetails } from '@modules/shared/models/ocr-details.model';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { Express } from 'express';
import { RateLimit, SetRateLimit } from '@modules/rate-limit/rate-limit.decorator';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { Config } from '@config/config';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { MulterFile } from '@modules/shared/models/multer-file.model';

export class UpdateDocumentDto {
    @ApiProperty()
    @IsString()
    fileName: string;
}

export class CreateDocumentDto {
    @IsUUID('4')
    @IsOptional()
    @ApiProperty()
    storageName?: string;

    @IsString()
    @ApiProperty()
    fileName: string;

    @IsString()
    @ApiProperty()
    fileDirectory: string;

    @IsOptional()
    @ApiProperty({ type: () => OcrDetails })
    ocr?: OcrDetails;
}

export class CreateDocumentsDto {
    @ApiProperty()
    @ValidateNested()
    documents: CreateDocumentDto[];
}

export class CreateDocumentBodyDto {
    @IsDefined()
    @ApiProperty()
    file: any;

    @IsDefined()
    @ApiProperty({ type: () => CreateDocumentDto })
    body: CreateDocumentDto;

    @IsOptional()
    @ApiProperty()
    ocr?: boolean;
}

export class CreateDocumentsBodyDto {
    @IsDefined()
    @ApiProperty()
    file: any[];

    @IsDefined()
    @ApiProperty({ type: () => CreateDocumentsDto })
    body: CreateDocumentsDto;

    @IsOptional()
    @ApiProperty()
    ocr?: boolean;
}

export class LinkDocumentParamDto {
    @IsDefined()
    documentId: number;
    @IsIn(Object.values(DocumentLinkableTargets))
    @IsDefined()
    target: DocumentLinkableTargets;
    @IsDefined()
    targetId: string;
}

@Controller('document')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Documents & Files')
export class DocumentController {
    constructor(
        private getDocumentService: GetDocumentService,
        private getDocumentsService: GetDocumentsService,
        @Inject(forwardRef(() => CreateDocumentService))
        private createDocumentService: CreateDocumentService,
        private updateDocumentService: UpdateDocumentService,
        private linkDocumentService: LinkDocumentService,
        private deleteDocumentService: DeleteDocumentService,
        private antivirusService: AntivirusService,
    ) {}

    @Get(':documentId')
    @RateLimit()
    @SetRateLimit(
        RateLimitActions.downloadDocument,
        Config.get.rateLimit.actions.downloadDocument,
        `You cannot download more than {{limit}} files per day.`,
    )
    @ApiResponse({ status: 400, description: ERROR_CODES.E044_CouldNotFindDocument.message({ documentId: 'documentId' }) })
    @ApiOperation({ summary: 'Get document by DocumentId' })
    async getDocument(@Param('documentId') documentId: number): Promise<Document> {
        return this.getDocumentService.getDocument(documentId);
    }

    @Delete(':documentId')
    @ApiExcludeEndpoint()
    async deleteDocument(@Param('documentId') documentId: number): Promise<Document> {
        return this.deleteDocumentService.deleteDocument(documentId);
    }

    @Get(':documentId/file')
    @ApiExcludeEndpoint()
    async getDocumentFile(@Param('documentId') documentId: number, @Res() res) {
        const result = await this.getDocumentService.getDocumentFile(documentId);

        if (result.document.fileName.includes('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
        }
        res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(result.document.fileName)}`);
        // res.set('Content-Type', 'text/csv');
        res.status(200).send(result.file);
    }

    @Get()
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getDocuments(): Promise<Document[]> {
        return this.getDocumentsService.getDocuments();
    }

    @Get('vehicle/:vehicleId')
    @ApiExcludeEndpoint()
    async getDocumentsForVehicle(@Param('vehicleId') vehicleId: number): Promise<Document[]> {
        return this.getDocumentsService.getDocumentsForVehicle(vehicleId);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Create document' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 400,
        description: ' * ' + ERROR_CODES.E025_ErrorFromContractOCR.message() + '\n * ' + ERROR_CODES.E043_FailedToAddDocument.message(),
    })
    @ApiResponse({ status: 500, description: ERROR_CODES.E122_CrateDocumentDtoMissingFilename.message({ dto: 'CreateDocumentDto' }) })
    @ApiBody({
        type: CreateDocumentBodyDto,
    })
    async createDocumentOcr(
        @UploadedFile() file: Express.Multer.File,
        @Body('body') body: string,
        @Body('ocr') ocr: string,
    ): Promise<Document> {
        await this.antivirusService.scanBuffer(file.buffer);
        const parsedBody = safeParse<CreateDocumentDto>(body, {
            fileDirectory: 'documents',
            fileName: file.originalname,
        });

        const errors = await validate(parsedBody);
        if (errors && errors.length >= 1) {
            throw new BadRequestException({ message: ERROR_CODES.E043_FailedToAddDocument.message(), error: JSON.stringify(errors) });
        }
        let ocrBoolean: boolean = false;
        if (ocr === 'true') {
            ocrBoolean = true;
        }
        return this.createDocumentService.saveDocumentFileOcrAndCreate(parsedBody, file, ocrBoolean);
    }

    @Post('batch')
    @UseInterceptors(FilesInterceptor('files[]', 20, {}))
    @ApiOperation({ summary: 'Create documents' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 400,
        description: ' * ' + ERROR_CODES.E025_ErrorFromContractOCR.message() + '\n * ' + ERROR_CODES.E043_FailedToAddDocument.message(),
    })
    @ApiResponse({ status: 500, description: ERROR_CODES.E122_CrateDocumentDtoMissingFilename.message({ dto: 'CreateDocumentDto' }) })
    @ApiBody({
        type: CreateDocumentsBodyDto,
    })
    async createDocumentsOcr(
        @UploadedFiles() files: MulterFile[],
        @Body('body') body: string,
        @Body('ocr') ocr: string,
    ): Promise<Document[]> {
        if (files.length >= 20) {
            throw new BadRequestException({
                message: ERROR_CODES.E043_FailedToAddDocument.message(),
                error: JSON.stringify('To many files')
            });
        }

        const parsedBody = safeParse<CreateDocumentsDto>(body, {
            documents: []
        });

        if (parsedBody.documents.length !== files.length) {
            throw new BadRequestException({
                message: ERROR_CODES.E043_FailedToAddDocument.message(),
                error: JSON.stringify('Incorrect params')
            });
        }

        if (parsedBody.documents.length <= 0 || parsedBody.documents.length !== files.length) {
            return []
        }

        for (let file of files) {
            await this.antivirusService.scanBuffer(file.buffer);
        }

        const errors = await validate(parsedBody);
        if (errors && errors.length >= 1) {
            throw new BadRequestException({ message: ERROR_CODES.E043_FailedToAddDocument.message(), error: JSON.stringify(errors) });
        }

        let ocrBoolean: boolean = false;
        if (ocr === 'true') {
            ocrBoolean = true;
        }

        return this.createDocumentService.saveDocumentsFileOcrAndCreate(parsedBody, files, ocrBoolean);
    }

    @Post(':documentId')
    @ApiOperation({ summary: 'Update document by DocumentId' })
    async updateDocument(@Param('documentId') documentId: number, @Body() dto: UpdateDocumentDto): Promise<Document> {
        return this.updateDocumentService.updateDocument(documentId, dto);
    }

    @Post(':documentId/link/:target/:targetId')
    @ApiExcludeEndpoint()
    async linkDocument(@Param() dto: LinkDocumentParamDto): Promise<Document> {
        return this.linkDocumentService.linkDocumentToEntity(dto);
    }
}
