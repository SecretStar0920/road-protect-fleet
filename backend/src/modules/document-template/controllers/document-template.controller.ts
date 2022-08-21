import { Body, Controller, Delete, forwardRef, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { GetDocumentTemplateService } from '@modules/document-template/services/get-document-template.service';
import { GetDocumentTemplatesService } from '@modules/document-template/services/get-document-templates.service';
import { CreateDocumentTemplateService } from '@modules/document-template/services/create-document-template.service';
import { UpdateDocumentTemplateService } from '@modules/document-template/services/update-document-template.service';
import { DeleteDocumentTemplateService } from '@modules/document-template/services/delete-document-template.service';
import { DocumentTemplate, DocumentTemplateForm } from '@entities';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

export class UpdateDocumentTemplateDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    url: string;

    @IsDefined()
    @IsOptional()
    form: DocumentTemplateForm;
}

export class CreateDocumentTemplateDto {
    @IsString()
    name: string;

    @IsString()
    url: string;

    @IsIn(['en', 'he'])
    lang: string;

    @IsDefined()
    form: DocumentTemplateForm;
}

@Controller('document-template')
@UseGuards(UserAuthGuard)
export class DocumentTemplateController {
    constructor(
        private getDocumentTemplateService: GetDocumentTemplateService,
        private getDocumentTemplatesService: GetDocumentTemplatesService,
        @Inject(forwardRef(() => CreateDocumentTemplateService))
        private createDocumentTemplateService: CreateDocumentTemplateService,
        private updateDocumentTemplateService: UpdateDocumentTemplateService,
        private deleteDocumentTemplateService: DeleteDocumentTemplateService,
    ) {}

    @Get(':documentTemplateId')
    async getDocumentTemplate(@Param('documentTemplateId') documentTemplateId: number): Promise<DocumentTemplate> {
        return await this.getDocumentTemplateService.getDocumentTemplate(documentTemplateId);
    }

    @Get()
    async getDocumentTemplates(): Promise<DocumentTemplate[]> {
        return await this.getDocumentTemplatesService.getDocumentTemplates();
    }

    @Post()
    @UseGuards(SystemAdminGuard)
    async createDocumentTemplate(@Body() dto: CreateDocumentTemplateDto): Promise<DocumentTemplate> {
        return await this.createDocumentTemplateService.createDocumentTemplate(dto);
    }

    @Post(':documentTemplateId')
    @UseGuards(SystemAdminGuard)
    async updateDocumentTemplate(
        @Param('documentTemplateId') documentTemplateId: number,
        @Body() dto: UpdateDocumentTemplateDto,
    ): Promise<DocumentTemplate> {
        return await this.updateDocumentTemplateService.updateDocumentTemplate(documentTemplateId, dto);
    }

    @Delete(':documentTemplateId')
    @UseGuards(SystemAdminGuard)
    async deleteDocumentTemplate(@Param('documentTemplateId') documentTemplateId: number): Promise<DocumentTemplate> {
        return await this.deleteDocumentTemplateService.deleteDocumentTemplate(documentTemplateId);
    }

    @Delete(':documentTemplateId/soft')
    @UseGuards(SystemAdminGuard)
    async softDeleteDocumentTemplate(@Param('documentTemplateId') documentTemplateId: number): Promise<DocumentTemplate> {
        return await this.deleteDocumentTemplateService.softDeleteDocumentTemplate(documentTemplateId);
    }
}
