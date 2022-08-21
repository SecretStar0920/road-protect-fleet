import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    Post,
    Query,
    Res,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Logger } from '../../shared/services/logger.service';
import { MulterFile } from '../../shared/models/multer-file.model';
import { ConvertService } from '../services/convert.service';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { HtmlToPdfService } from '../services/html-to-pdf.service';

export class ConvertQueryDto {
    @IsIn(['pdf'])
    format: string;

    @IsString()
    glob: string;
}

export class HtmlToPdfDto {
    @IsOptional()
    @IsString()
    html: string; // Full html page

    @IsOptional()
    @IsString()
    route: string; // A route to render
}

@Controller('convert')
export class ConvertController {
    constructor(private convertService: ConvertService, private logger: Logger, private htmlToPdfService: HtmlToPdfService) {}

    @Post('')
    @UseInterceptors(FilesInterceptor('files', 1, {}))
    async convert(@Body() body, @UploadedFiles() files: MulterFile[], @Res() res, @Query() query: ConvertQueryDto) {
        throw new BadRequestException('Endpoint currently in development');
        try {
            const convertedFiles = await this.convertService.convert(files, query.format, query.glob);
            res.setHeader('Content-Disposition', `attachment; filename=output.pdf`);
            // res.set('Content-Type', 'text/csv');
            res.status(200).send(convertedFiles);
        } catch (e) {
            throw new InternalServerErrorException('Failed to convert the given files');
        }
    }

    @Post('html-to-pdf')
    async htmlToPdf(@Body() data: HtmlToPdfDto, @Res() res) {
        this.logger.debug('Starting conversion', data, this.htmlToPdf.name);
        try {
            const pdf = await this.htmlToPdfService.htmlToPdf(data);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=output.pdf`);
            res.status(200).send(pdf);
        } catch (e) {
            this.logger.error('Something went wrong', e, this.htmlToPdf.name);
            throw new InternalServerErrorException('Failed to convert the html to pdf', e);
        }
    }
}
