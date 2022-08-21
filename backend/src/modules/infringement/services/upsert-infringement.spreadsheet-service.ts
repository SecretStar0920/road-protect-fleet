import { delay } from 'rxjs/operators';
import { chunk, isEmpty, merge } from 'lodash';
import { Account, Infringement, Issuer, RedirectionType } from '@entities';
import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { plainToClass } from 'class-transformer';
import { SpreadsheetService } from '@modules/shared/services/spreadsheet-service';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { SpreadsheetUploadCompleteResponse, UploadSpreadsheetResult } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { validate, ValidationError } from 'class-validator';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { validatorExceptionFactoryString } from '@modules/shared/helpers/validator-exception-factory.helper';
import { UpsertInfringementService } from '@modules/infringement/services/upsert-infringement.service';
import { UpsertInfringementDto } from '@modules/infringement/controllers/upsert-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpsertSpreadsheetResult } from '@modules/infringement/services/upsert-spreadsheet-result';
import { UpsertInfringementSpreadsheetUploadResponse } from '@modules/infringement/services/upsert-infringement-spreadsheet-upload-response';
import { IssuerDoesNotExistForManualRedirectionException } from '@modules/infringement/exceptions/issuer-does-not-exist-for-manual-redirection.exception';
import { MultipleIssuersInSpreadsheetException } from '@modules/infringement/exceptions/multiple-issuers-in-spreadsheet.exception';
import { Brackets } from 'typeorm';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { Config } from '@config/config';
import { Promax } from 'promax';
import { promiseTimeout } from '@modules/shared/helpers/promise-timeout';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { NominationStatus } from '@modules/shared/models/nomination-status';

interface ExistingInfringement {
    noticeNumber: string;
    issuer: {
        name: string;
        issuerId: number;
    };
}

interface UploadedInfringements {
    [noticeNumber: string]: true;
}

interface UpsertValidationContext {
    issuers: Issuer[];
}

@Injectable()
export class UpsertInfringementSpreadsheetService extends SpreadsheetService<UpsertInfringementDto, UpsertValidationContext> {
    constructor(
        protected logger: Logger,
        private upsertInfringementService: UpsertInfringementService,
        protected createDataSpreadsheetService: XlsxService,
        protected createDocumentService: CreateDocumentService,
    ) {
        super(createDataSpreadsheetService, createDocumentService);
    }

    async checkValidity(spreadsheetData: any[], context: UpsertValidationContext): Promise<UploadSpreadsheetResult<UpsertInfringementDto>> {
        const results: UploadSpreadsheetResult<UpsertInfringementDto> = new UploadSpreadsheetResult<UpsertInfringementDto>();
        await this.checkDtoValid(spreadsheetData, results, context);
        // await this.checkDatabaseValid(results); //FIXME: this errors on massive uploads due to the size of the query string it tries to build
        return results;
    }

    async checkDtoValid(
        data: any[],
        results: UploadSpreadsheetResult<UpsertInfringementDto>,
        context: UpsertValidationContext,
    ): Promise<void> {
        this.logger.debug({ message: 'Checking Dto valid', detail: {}, fn: this.checkDtoValid.name });
        // Check row by row

        const foundMap = this.createFoundMap(await this.findExistingInfringements(data));
        const issuerMap = this.createIssuerMap(context.issuers);
        const restrictIssuers = context.issuers.length > 0;

        for (const row of data) {
            const found = !!foundMap[row.noticeNumber];
            const item = found ? plainToClass(UpdateInfringementDto, row as object) : plainToClass(CreateInfringementDto, row as object);
            const outputDto = plainToClass(UpsertInfringementDto, row as object)
                .markAsExternalChange()
                .markSetRedirectionIdentifier()
                .setRedirectionType(RedirectionType.Upload);

            if (restrictIssuers && !issuerMap[outputDto.issuer]) {
                throw new MultipleIssuersInSpreadsheetException(
                    context.issuers.map((issuer) => issuer.name).join(' or '),
                    outputDto.issuer,
                );
            }

            const errors: ValidationError[] = (await validate(item)).concat(await validate(outputDto));

            if (!isEmpty(errors)) {
                results.invalid.push(merge(outputDto, { error: validatorExceptionFactoryString(errors) })); // Store invalid
            } else {
                results.valid.push(outputDto); // Store valid
            }
        }
        this.logger.debug({ message: 'Dto validity counts: ', detail: results.counts, fn: this.verify.name });
    }

    async checkDatabaseValid(results: UploadSpreadsheetResult<UpsertInfringementDto>): Promise<void> {
        // Check database valid
        this.logger.debug({ message: 'Checking database valid', detail: undefined, fn: this.checkDatabaseValid.name });
        // Only check if there are valid results so far
        if (!isEmpty(results.valid)) {
            const found: any[] = await this.findExistingInfringements(results.valid);

            this.logger.debug({
                message: 'Upsert statistics found: ',
                detail: {
                    update: found.length,
                    insert: results.valid.length - found.length,
                },
                fn: this.checkDatabaseValid.name,
            });
        }
        this.logger.debug({ message: 'Database validity counts: ', detail: results.counts, fn: this.checkDatabaseValid.name });
    }

    async verify(dto: SpreadsheetUploadDto, file: MulterFile) {
        const spreadsheetData = await this.getSpreadsheetData(dto, file);

        this.logger.debug({ message: 'Verifying', detail: spreadsheetData.length, fn: this.verify.name });
        const issuers = await this.findIssuers(dto);
        const results = await this.checkValidity(spreadsheetData, { issuers });

        return SpreadsheetUploadCompleteResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
        );
    }

    async upload(dto: SpreadsheetUploadDto, file: MulterFile, socket: DistributedWebsocket) {
        // Use verification function so we only try create valid items
        this.logger.debug({ message: `Running an upsert spreadsheet`, fn: this.upload.name });
        const spreadsheetData = await this.getSpreadsheetData(dto, file);
        this.logger.debug({ message: `Upserting ${spreadsheetData.length} infringements`, fn: this.upload.name });
        const issuers = await this.findIssuers(dto);
        const account = await this.findAccount(dto);
        const verifyResults = await this.checkValidity(spreadsheetData, { issuers });
        const results: UpsertSpreadsheetResult = new UpsertSpreadsheetResult();

        this.logger.log({ message: 'Uploading valid infringements', detail: verifyResults.valid.length, fn: this.upload.name });

        this.startNotify({ socket });
        const total = verifyResults.valid.length;

        await this.progressNotify({ socket, counts: { ...results.counts, total } });
        // We need to make sure that the other async tasks are being handled
        await delay(500);

        // Keep track of all of the infringements that were uploaded already. Keep in mind
        // that you have to select the issuer so we only need the notice number at this
        // point.
        const uploadedInfringements: UploadedInfringements = {};

        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        });
        promax.add(
            verifyResults.valid.map((item) => async () => {
                uploadedInfringements[item.noticeNumber] = true;
                try {
                    const savedInfringement = await promiseTimeout(
                        this.upsertInfringementService.upsertBySpreadsheetDto(item),
                        Config.get.systemPerformance.safePromiseTimeoutMs,
                    );
                    await this.progressNotify({ socket, counts: { ...results.counts, total } });
                    results.addValid(item, savedInfringement.type);
                    await delay(50);
                    return item.noticeNumber;
                } catch (e) {
                    this.logger.warn({
                        message: 'Failed to upload infringement',
                        detail: {
                            error: e.message,
                            stack: e.stack,
                        },
                        fn: this.upload.name,
                    });
                    results.invalid.push(this.createErrorItem(item, e.message));
                    await this.progressNotify({ socket, counts: { ...results.counts, total } });
                    await delay(500);
                    return {
                        error: e.message,
                        stack: e.stack,
                        noticeNumber: item.noticeNumber,
                    };
                }
            }),
        );

        await promax.run();

        this.logger.log({ message: 'Uploaded infringements', detail: results.valid.length, fn: this.upload.name });
        if (promax.getResultMap().error.length > 0) {
            this.logger.error({
                fn: this.upload.name,
                message: `Failed to upsert the following infringements`,
                detail: {
                    infringements: promax.getResultMap().error,
                },
            });
        }

        const finalResult = UpsertInfringementSpreadsheetUploadResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
            await this.findMissingInfringements(issuers, account, uploadedInfringements),
        );

        this.endNotify({ socket, result: finalResult });
    }

    private async findIssuers(dto: SpreadsheetUploadDto): Promise<Issuer[] | []> {
        if (dto.additionalParameters.issuerIds.length === 0) {
            return [];
        }
        const issuers = await Issuer.createQueryBuilder('issuer')
            .where('issuer.issuerId IN (:...issuerIds)', dto.additionalParameters)
            .getMany();
        if (issuers.length !== dto.additionalParameters.issuerIds.length) {
            throw new IssuerDoesNotExistForManualRedirectionException(`${dto.additionalParameters?.issuerId}`);
        }
        return issuers;
    }

    private async findAccount(dto: SpreadsheetUploadDto): Promise<Account | null> {
        if (!dto.additionalParameters?.accountId) {
            return null;
        }
        return Account.findWithMinimalRelations()
            .where('account.accountId = :accountId', {
                accountId: dto.additionalParameters.accountId,
            })
            .getOne();
    }

    async generateValidDocument(data: any): Promise<number> {
        return super.generateValidDocument(data, 'valid-infringements', 'infringement-uploads');
    }

    async generateInvalidDocument(data: any): Promise<number> {
        return super.generateInvalidDocument(data, 'invalid-infringements', 'infringement-uploads');
    }

    private async findExistingInfringements(infringements: any[]): Promise<ExistingInfringement[]> {
        const infringementChunks = chunk(infringements, Config.get.systemPerformance.queryChunkSize);

        const promax = Promax.create<ExistingInfringement[]>(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: true,
        });

        for (const infringementChunk of infringementChunks) {
            promax.add(async () => {
                const params: any = {};
                const paramStrings: string[] = [];
                let uniqueCount = 0;
                for (const item of infringementChunk) {
                    paramStrings.push(`(:noticeNumber${uniqueCount}, :issuerName${uniqueCount})`);
                    params[`noticeNumber${uniqueCount}`] = item.noticeNumber;
                    params[`issuerName${uniqueCount}`] = item.issuer;
                    uniqueCount++;
                }

                const query = Infringement.createQueryBuilder('infringement')
                    .select(['infringement.noticeNumber'])
                    .innerJoin('infringement.issuer', 'issuer')
                    .addSelect(['issuer.name', 'issuer.issuerId'])
                    .andWhere(`( infringement.noticeNumber, issuer.name ) IN (${paramStrings.join(', ')})`, params);

                return await query.getMany();
            });
        }
        await promax.run();
        return promax.getResultMap().valid.reduce((a, b) => a.concat(b), []);
    }

    private createFoundMap(found: ExistingInfringement[]): { [noticeNumber: string]: ExistingInfringement } {
        const result: { [noticeNumber: string]: ExistingInfringement } = {};
        for (const item of found) {
            result[item.noticeNumber] = item;
        }
        return result;
    }

    private async findMissingInfringements(issuers: Issuer[], account: Account | null, uploadedInfringements: UploadedInfringements) {
        // Don't return missing infringements if issuers aren't selected
        if (!issuers.length) {
            return [];
        }

        const allInfringementsQuery = Infringement.findWithMinimalRelationsAndAccounts()
            .andWhere('nomination.status = :status', {
                status: NominationStatus.InRedirectionProcess,
            })
            .andWhere('issuer.issuerId IN (:...issuerIds)', {
                issuerIds: issuers.map((issuer) => issuer.issuerId),
            });

        if (account) {
            allInfringementsQuery.andWhere(
                new Brackets((qb) =>
                    qb.orWhere('account.accountId = :accountId', account).orWhere('owner.accountId = :accountId', account),
                ),
            );
        }

        const allInfringements = await allInfringementsQuery.getMany();

        return allInfringements.filter((infringement) => !uploadedInfringements[infringement.noticeNumber]);
    }

    private createIssuerMap(issuers: Issuer[]): { [codeOrName: string]: true } {
        const result: { [codeOrName: string]: true } = {};
        issuers.forEach((issuer) => {
            result[issuer.code] = true;
            result[issuer.name] = true;
        });
        return result;
    }
}
