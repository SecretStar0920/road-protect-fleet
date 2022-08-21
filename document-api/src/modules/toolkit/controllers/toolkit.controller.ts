import { Controller, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MergeService } from '../services/merge.service';
import { pdfFilter } from '../../shared/functions/pdf-filter.multer';
import { Logger } from '../../shared/services/logger.service';
import { MulterFile } from '../../shared/models/multer-file.model';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('toolkit')
export class ToolkitController {
    constructor(private mergeService: MergeService, private logger: Logger) {}

    @Post('merge')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            fileFilter: pdfFilter,
        }),
    )
    async merge(@UploadedFiles() files: MulterFile[], @Res() res) {
        const mergedPdf = await this.mergeService.merge(files);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=output.pdf`);
        // res.set('Content-Type', 'text/csv');
        res.status(200).send(mergedPdf);
    }
}
