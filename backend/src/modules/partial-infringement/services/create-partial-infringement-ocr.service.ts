import { Logger } from '@logger';
import { Injectable } from '@nestjs/common';
import { CreatePartialInfringementService } from '@modules/partial-infringement/services/create-partial-infringement.service';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { PartialInfringementDetailsDto } from '@modules/partial-infringement/dtos/partial-infringement-details.dto';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { UploadOcrPartialInfringementsResponse } from '@modules/partial-infringement/dtos/upload-ocr-partial-infringements-response';
import { EMPTY, from } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { isObject, isString } from 'class-validator';
import flatten = require('flat');
import * as moment from 'moment';
import { CreatePartialInfringementDto } from '@modules/partial-infringement/dtos/create-partial-infringement.dto';
import { OcrPartialInfringementService } from '@modules/partial-infringement/services/ocr-partial-infringement.service';
import { UploadOcrPartialInfringementsDto } from '@modules/partial-infringement/dtos/upload-ocr-partial-infringements.dto';
import { Document } from '@entities';

@Injectable()
export class CreatePartialInfringementOcrService {
    constructor(
        protected logger: Logger,
        private createPartialInfringementService: CreatePartialInfringementService,
        private ocrPartialInfringementService: OcrPartialInfringementService,
        protected createDocumentService: CreateDocumentService,
        private antivirusService: AntivirusService
    ) {}

    async upload(uploadDto: UploadOcrPartialInfringementsDto, file: MulterFile, socket: DistributedWebsocket): Promise<UploadOcrPartialInfringementsResponse> {
        await this.antivirusService.scanBuffer(file.buffer);

        const document = await this.saveFile(uploadDto.issuerName, file)

        const infringementsDto = await this.ocrPartialInfringementService.processPartialInfringementFile(
            uploadDto.issuerName,
            uploadDto.documentsNumber,
            uploadDto.isCompleteList,
            document,
            file
        );

        const createInfringementsDto = infringementsDto.map(this.convertToCreatePartialInfringementDto);

        const results = new UploadOcrPartialInfringementsResponse([], []);

        this.logger.log({ message: 'Uploading ocr partial infringements', detail: createInfringementsDto.length, fn: this.upload.name });

        this.startNotify({ socket });
        const total = createInfringementsDto.length;

        /**
         * Using a mixture of observables and promises to achieve
         * concurrent creates
         */
        const jobs = from(createInfringementsDto).pipe(
            // For each valid result attempt to concurrently perform an action
            mergeMap((item) => {
                return from(this.createPartialInfringementService.createPartialInfringement(item)).pipe(
                    // If the job fails push to invalid verifyResults
                    catchError((e) => {
                        this.logger.warn({
                            message: 'Failed to upload ocr partial infringements',
                            detail: {
                                error: e.message,
                                stack: e.stack,
                            },
                            fn: this.upload.name,
                        });

                        results.invalid.push(this.createErrorItem(item, e));

                        // Socket progress for the invalid item
                        this.progressNotify({
                            socket,
                            counts: {
                                valid: results.valid.length,
                                invalid: results.invalid.length,
                                total: total
                            }
                        });

                        return EMPTY;
                    }),
                    // If no errors, push to valid verifyResults
                    tap((savedPartialInfringement) => {
                        results.valid.push(savedPartialInfringement);

                        // Socket progress for the valid item
                        this.progressNotify({ socket, counts: {
                                valid: results.valid.length,
                                invalid: results.invalid.length,
                                total: total
                            }
                        });
                    }),
                );
                // Concurrency
            }, 1),
        );

        await jobs.toPromise();

        this.logger.log({ message: 'Uploaded ocr partial infringements', detail: results.valid.length, fn: this.upload.name });

        this.endNotify({ socket, result: results });
        return results;
    }

    private async saveFile(issuerName: string, file: MulterFile): Promise<Document> {
        let mimeParts = file.mimetype.split('/')
        let extension = '.file'
        if (mimeParts.length > 1) {
            extension = mimeParts[1]
        }

        return this.createDocumentService.saveDocumentFileAndCreate(
            {
                fileName: `ocr_infringement-${moment().format('DD-MM-YYYY')}.${extension}`,
                fileDirectory: 'ocr-infringement-uploads',
            },
            file.buffer,
        );
    }

    private convertToCreatePartialInfringementDto(partialInfringement: PartialInfringementDetailsDto): CreatePartialInfringementDto {
        const createDto = new CreatePartialInfringementDto();
        createDto.details = partialInfringement;
        createDto.noticeNumber = partialInfringement.noticeNumber;
        return createDto;
    }

    // Socket progress
    private startNotify({ socket, message }: { socket: DistributedWebsocket; message?: string }) {
        socket.emit('upload', { type: 'start', message: message || 'Upload started' });
    }

    private progressNotify({
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

    private endNotify({
                  socket,
                  message = 'Upload finished',
                  result,
              }: {
        socket: DistributedWebsocket;
        message?: string;
        result: UploadOcrPartialInfringementsResponse;
    }) {
        socket.emit('upload', { type: 'end', message, result });
    }

    // Utils

    private createErrorItem<T>(item: T, error: any): any {
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
}
