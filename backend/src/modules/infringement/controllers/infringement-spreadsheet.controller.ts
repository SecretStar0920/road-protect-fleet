import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpreadsheetUploadCompleteResponse } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { plainToClass } from 'class-transformer';
import { CreateInfringementSpreadsheetService } from '@modules/infringement/services/create-infringement.spreadsheet-service';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { isEmpty } from 'lodash';
import { validatorExceptionFactory } from '@modules/shared/helpers/validator-exception-factory.helper';
import { UpdateInfringementSpreadsheetService } from '@modules/infringement/services/update-infringement.spreadsheet-service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';
import { UserTimezone } from '@modules/shared/decorators/user-timezone.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { UpsertInfringementSpreadsheetService } from '@modules/infringement/services/upsert-infringement.spreadsheet-service';
import { ManualInfringementRedirectionSpreadsheetService } from '@modules/infringement/services/manual-infringement-redirection.spreadsheet-service';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { Express } from 'express';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Controller('infringement/spreadsheet')
@UseGuards(UserAuthGuard)
export class InfringementSpreadsheetController {
    constructor(
        private createInfringementSpreadsheetService: CreateInfringementSpreadsheetService,
        private updateInfringementSpreadsheetService: UpdateInfringementSpreadsheetService,
        private upsertInfringementSpreadsheetService: UpsertInfringementSpreadsheetService,
        private manualInfringementRedirectionSpreadsheetService: ManualInfringementRedirectionSpreadsheetService,
        private antivirusService: AntivirusService,
    ) {}

    @Post('verify')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fieldSize: 25 * 1024 * 1024,
            },
        }),
    )
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.CreateInfringement)
    @ApiExcludeEndpoint()
    async verify(@UploadedFile() file: Express.Multer.File, @Body('body') body: string): Promise<SpreadsheetUploadCompleteResponse> {
        await this.antivirusService.scanBuffer(file.buffer);
        const parsedBody: SpreadsheetUploadDto = plainToClass(SpreadsheetUploadDto, JSON.parse(body) as object);
        const validationErrors = await validate(parsedBody);
        if (!isEmpty(validationErrors)) {
            throw new BadRequestException({
                message: ERROR_CODES.E030_InvalidUploadedData.message(),
                error: validatorExceptionFactory(validationErrors),
            });
        }

        if (parsedBody.method === 'create') {
            return await this.createInfringementSpreadsheetService.verify(parsedBody, file);
        } else if (parsedBody.method === 'update') {
            return await this.updateInfringementSpreadsheetService.verify(parsedBody, file);
        } else if (parsedBody.method === 'upsert') {
            return await this.upsertInfringementSpreadsheetService.verify(parsedBody, file);
        } else if (parsedBody.method === 'manualRedirection') {
            return await this.manualInfringementRedirectionSpreadsheetService.verify(parsedBody, file);
        } else {
            throw new BadRequestException({ message: ERROR_CODES.E033_MethodNotSupportedORProvidedIncorrectly.message() });
        }
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fieldSize: 25 * 1024 * 1024,
            },
        }),
    )
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.CreateInfringement)
    @ApiExcludeEndpoint()
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('body') body: string,
        @UserSocket() socket: DistributedWebsocket,
        @UserTimezone() timezone: string,
    ) {
        await this.antivirusService.scanBuffer(file.buffer);
        const parsedBody: SpreadsheetUploadDto = plainToClass(SpreadsheetUploadDto, JSON.parse(body) as object);
        const validationErrors = await validate(parsedBody);
        if (!isEmpty(validationErrors)) {
            throw new BadRequestException({
                message: ERROR_CODES.E030_InvalidUploadedData.message(),
                error: validatorExceptionFactory(validationErrors),
            });
        }

        if (parsedBody.method === 'create') {
            this.createInfringementSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else if (parsedBody.method === 'update') {
            this.updateInfringementSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else if (parsedBody.method === 'upsert') {
            this.upsertInfringementSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else if (parsedBody.method === 'manualRedirection') {
            this.manualInfringementRedirectionSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else {
            throw new BadRequestException({ message: ERROR_CODES.E030_InvalidUploadedData.message() });
        }
    }
}
