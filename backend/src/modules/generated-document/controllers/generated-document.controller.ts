import { Body, Controller, Delete, forwardRef, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { GetGeneratedDocumentService } from '@modules/generated-document/services/get-generated-document.service';
import { GetGeneratedDocumentsService } from '@modules/generated-document/services/get-generated-documents.service';
import { CreateGeneratedDocumentService } from '@modules/generated-document/services/create-generated-document.service';
import { UpdateGeneratedDocumentService } from '@modules/generated-document/services/update-generated-document.service';
import { DeleteGeneratedDocumentService } from '@modules/generated-document/services/delete-generated-document.service';
import { DocumentTemplateForm, GeneratedDocument } from '@entities';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { MicroserviceGuard } from '@modules/auth/guards/microservice.guard';
import { Config } from '@config/config';
import { RenderGeneratedDocumentService } from '@modules/generated-document/services/render-generated-document.service';
import { ConfirmGeneratedDocumentService } from '@modules/generated-document/services/confirm-generated-document.service';
import { LinkDocumentParamDto } from '@modules/document/controllers/document.controller';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

export class UpdateGeneratedDocumentDto {
    @IsDefined()
    form: DocumentTemplateForm;
}

export class CreateGeneratedDocumentDto {
    @IsString()
    documentTemplateName: string;

    // Autofill parameters
    @IsNumber()
    @IsOptional()
    accountId?: number;

    @IsNumber()
    @IsOptional()
    contractId?: number;

    @IsNumber()
    @IsOptional()
    infringementId?: number;
}

@Controller('generated-document')
export class GeneratedDocumentController {
    constructor(
        private getGeneratedDocumentService: GetGeneratedDocumentService,
        private getGeneratedDocumentsService: GetGeneratedDocumentsService,
        @Inject(forwardRef(() => CreateGeneratedDocumentService))
        private createGeneratedDocumentService: CreateGeneratedDocumentService,
        private updateGeneratedDocumentService: UpdateGeneratedDocumentService,
        private deleteGeneratedDocumentService: DeleteGeneratedDocumentService,
        @Inject(forwardRef(() => RenderGeneratedDocumentService))
        private generateGeneratedDocumentService: RenderGeneratedDocumentService,
        private confirmGeneratedDocumentService: ConfirmGeneratedDocumentService,
    ) {}

    @Get(':generatedDocumentId')
    @UseGuards(UserAuthGuard)
    async getGeneratedDocument(@Param('generatedDocumentId') generatedDocumentId: number): Promise<GeneratedDocument> {
        return await this.getGeneratedDocumentService.getGeneratedDocument(generatedDocumentId);
    }

    @Get(':generatedDocumentId/renderer')
    @UseGuards(new MicroserviceGuard(Config.get.siblings['document-renderer'].name))
    async getGeneratedDocumentForRenderer(@Param('generatedDocumentId') generatedDocumentId: number): Promise<GeneratedDocument> {
        return await this.getGeneratedDocumentService.getGeneratedDocument(generatedDocumentId);
    }

    @Get()
    @UseGuards(SystemAdminGuard)
    @UseGuards(UserAuthGuard)
    async getGeneratedDocuments(): Promise<GeneratedDocument[]> {
        return await this.getGeneratedDocumentsService.getGeneratedDocuments();
    }

    @Post()
    @UseGuards(UserAuthGuard)
    async createGeneratedDocument(@Body() dto: CreateGeneratedDocumentDto): Promise<GeneratedDocument> {
        return await this.createGeneratedDocumentService.createGeneratedDocument(dto);
    }

    @Post(':generatedDocumentId')
    @UseGuards(UserAuthGuard)
    async updateGeneratedDocument(
        @Param('generatedDocumentId') generatedDocumentId: number,
        @Body() dto: UpdateGeneratedDocumentDto,
    ): Promise<GeneratedDocument> {
        return await this.updateGeneratedDocumentService.updateGeneratedDocument(generatedDocumentId, dto);
    }

    @Delete(':generatedDocumentId')
    @UseGuards(UserAuthGuard)
    async deleteGeneratedDocument(@Param('generatedDocumentId') generatedDocumentId: number): Promise<GeneratedDocument> {
        return await this.deleteGeneratedDocumentService.deleteGeneratedDocument(generatedDocumentId);
    }

    @Delete(':generatedDocumentId/soft')
    @UseGuards(UserAuthGuard)
    async softDeleteGeneratedDocument(@Param('generatedDocumentId') generatedDocumentId: number): Promise<GeneratedDocument> {
        return await this.deleteGeneratedDocumentService.softDeleteGeneratedDocument(generatedDocumentId);
    }

    @Post(':generatedDocumentId/generate')
    @UseGuards(UserAuthGuard)
    async renderGeneratedDocument(@Param('generatedDocumentId') generatedDocumentId: number): Promise<GeneratedDocument> {
        return await this.generateGeneratedDocumentService.renderGeneratedDocument(generatedDocumentId);
    }

    @Post(':generatedDocumentId/confirm')
    @UseGuards(UserAuthGuard)
    async confirmGeneratedDocument(
        @Param('generatedDocumentId') generatedDocumentId: number,
        @Body() dto: LinkDocumentParamDto,
    ): Promise<GeneratedDocument> {
        return await this.confirmGeneratedDocumentService.confirmGeneratedDocument(generatedDocumentId, dto);
    }
}
