import { Injectable } from '@nestjs/common';
import { Logger } from '../../shared/services/logger.service';
import * as path from 'path';
import { DirectoryService } from '../../shared/services/directory.service';
import { FileService } from '../../shared/services/file.service';
import { HtmlToPdfDto } from '../controllers/convert.controller';
import * as puppeteer from 'puppeteer';

@Injectable()
export class HtmlToPdfService {
    private directory = path.join('storage/convert');

    constructor(private logger: Logger, private directoryService: DirectoryService, private fileService: FileService) {}

    async htmlToPdf(dto: HtmlToPdfDto): Promise<Buffer> {
        this.logger.log(`Converting HTML to PDF ${dto.route}`);
        try {
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
            const page = await browser.newPage();
            if (dto.route) {
                this.logger.debug(`Navigating to route ${dto.route}`);
                await page.goto(dto.route, { waitUntil: 'networkidle2' });
            } else {
                this.logger.debug(`No route was specified so using direct HTML on dto`);
                await page.setContent(dto.html, { waitUntil: ['networkidle0'] });
            }
            const pdf = await page.pdf({
                format: 'a4',
                preferCSSPageSize: true,
                printBackground: true,
            });

            await browser.close();
            return pdf;
        } catch (e) {
            this.logger.error(`An error occurred while generating the pdf ${e.message}`);
            throw e;
        }
    }

    async sleep(ms: number) {
        return new Promise((resolve) => setTimeout(() => resolve(), ms));
    }
}
