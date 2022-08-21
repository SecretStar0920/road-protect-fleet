import { Config } from '@config/config';
import { DocumentFileDto } from '@modules/document/services/get-document.service';
import { httpClient, jsonToFormData } from '@modules/shared/http-client/http-client';
import { Logger } from '@logger';
import { isBuffer } from 'lodash';
/**
 * API class for use with the sibling system
 */
class DocumentApi {
    private url: string = Config.get.siblings['document-api'].url;
    logger = Logger.instance;

    async urlToPdf(url: string): Promise<Buffer> {
        return httpClient
            .post(`${this.url}/convert/html-to-pdf`, {
                json: {
                    route: url,
                },
                responseType: 'buffer',
            })
            .then((d) => d.body);
    }

    async htmlToPdf(html: string): Promise<Buffer> {
        return httpClient
            .post(`${this.url}/convert/html-to-pdf`, {
                json: {
                    html,
                },
                responseType: 'buffer',
            })
            .then((d) => d.body);
    }

    async mergePdfs(files: DocumentFileDto[]): Promise<Buffer> {
        const form = jsonToFormData({});

        for (const file of files) {
            if (file.file === undefined || file.file === null || file.file.length < 1) {
                this.logger.debug({ message: `Invalid file`, detail: file, fn: this.mergePdfs.name });
                continue;
            }
            const formOptions = {
                filename: file.document?.fileName ? file.document.fileName.replace('/', '_') : null,
                contentType: 'application/pdf',
            };
            form.append('files', file.file as Buffer, formOptions);
        }

        this.logger.debug({
            message: `Merging ${files.length} pdfs. Making a request to:`,
            detail: { url: `${this.url}/toolkit/merge` },
            fn: this.mergePdfs.name,
        });
        const response = await httpClient
            .post(`${this.url}/toolkit/merge`, {
                body: form,
                headers: form.getHeaders(),
                responseType: 'buffer',
            })
            .then((d) => d.body);

        return response;
    }
}

export const documentApi = new DocumentApi();
