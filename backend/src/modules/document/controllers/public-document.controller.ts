import { Controller, Get, Param, Res } from '@nestjs/common';
import { GetDocumentService } from '@modules/document/services/get-document.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('public-document')
@ApiBearerAuth()
@ApiTags('Public Documents & Files')
export class PublicDocumentController {
    constructor(private getDocumentService: GetDocumentService) {}

    @Get('fax/:documentId')
    @ApiOperation({ summary: 'Get document file by DocumentId' })
    async getDocumentFile(@Param('documentId') documentId: number, @Res() res) {
        const result = await this.getDocumentService.getDocumentFile(documentId);

        if (result.document.fileName.includes('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
        }
        res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(result.document.fileName)}`);
        // res.set('Content-Type', 'text/csv');
        res.status(200).send(result.file);
    }
}
