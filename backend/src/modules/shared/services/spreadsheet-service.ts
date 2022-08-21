import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { SpreadsheetUploadCompleteResponse, UploadSpreadsheetResult } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { XlsxService } from '../modules/spreadsheet/services/xlsx.service';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import * as moment from 'moment';
import { isObject, isString } from 'lodash';
import { flatten } from 'flat';

import { MulterFile } from '@modules/shared/models/multer-file.model';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

export abstract class SpreadsheetService<T = any, U = any> {
    protected constructor(protected createDataSpreadsheetService: XlsxService, protected createDocumentService: CreateDocumentService) {}

    async getSpreadsheetData(dto: SpreadsheetUploadDto, file: MulterFile): Promise<any[]> {
        dto.data = await this.createDataSpreadsheetService.extractJsonFromBuffer(file);
        return dto.toJSONArray();
    }

    abstract async verify(dto: SpreadsheetUploadDto, file: MulterFile);

    abstract async upload(dto: SpreadsheetUploadDto, file: MulterFile, socket: DistributedWebsocket);

    abstract async checkValidity(spreadsheetData: any[], context?: U): Promise<UploadSpreadsheetResult<T>>;

    abstract async checkDtoValid(data: any[], results: UploadSpreadsheetResult<T>, context?: U): Promise<void>;

    abstract async checkDatabaseValid(results: UploadSpreadsheetResult<T>): Promise<void>;

    async generateValidDocument(data: any, name: string, directory: string): Promise<number> {
        if (data.length <= 0) {
            return 0;
        }
        const file = await this.createDataSpreadsheetService.createXLSXBuffer(data, name);
        const document = await this.createDocumentService.saveDocumentFileAndCreate(
            {
                fileName: `${name}-${moment().format('DD-MM-YYYY')}.xlsx`,
                fileDirectory: directory,
            },
            file,
        );
        return document.documentId;
    }

    async generateInvalidDocument(data: any, name: string, directory: string): Promise<number> {
        if (data.length <= 0) {
            return 0;
        }
        const file = await this.createDataSpreadsheetService.createXLSXBuffer(data, name);
        const document = await this.createDocumentService.saveDocumentFileAndCreate(
            {
                fileName: `${name}-${moment().format('DD-MM-YYYY')}.xlsx`,
                fileDirectory: directory,
            },
            file,
        );
        return document.documentId;
    }

    // Helpers
    createErrorItem(item: T, error: any): any {
        if (isObject(error)) {
            if ((error as any).response) {
                return { ...item, ...flatten((error as any).response) };
            } else {
                return { ...item, errorMessage: 'Something went wrong, please contact support' };
            }
        } else if (isString(error)) {
            return { ...item, error };
        }
    }

    // Socket progress
    startNotify({ socket, message }: { socket: DistributedWebsocket; message?: string }) {
        socket.emit('upload', { type: 'start', message: message || 'Upload started' });
    }

    progressNotify({
        socket,
        message = 'Upload progress',
        counts,
    }: {
        socket: DistributedWebsocket;
        message?: string;
        counts: { valid: number; invalid: number; total: number };
    }) {
        socket.emit('upload', { type: 'progress', message, counts });
    }

    endNotify({
        socket,
        message = 'Upload finished',
        result,
    }: {
        socket: DistributedWebsocket;
        message?: string;
        result: SpreadsheetUploadCompleteResponse;
    }) {
        socket.emit('upload', { type: 'end', message, result });
    }
}
