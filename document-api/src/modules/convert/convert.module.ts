import { Module } from '@nestjs/common';
import { ConvertController } from './controllers/convert.controller';
import { ConvertService } from './services/convert.service';
import { HtmlToPdfService } from './services/html-to-pdf.service';

@Module({
    controllers: [ConvertController],
    providers: [ConvertService, HtmlToPdfService],
})
export class ConvertModule {}
