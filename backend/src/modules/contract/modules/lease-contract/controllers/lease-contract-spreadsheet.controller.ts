import { BadRequestException, Controller, NotImplementedException, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpreadsheetUploadCompleteResponse } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { plainToClass } from 'class-transformer';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { isEmpty } from 'lodash';
import { validatorExceptionFactory } from '@modules/shared/helpers/validator-exception-factory.helper';
import { CreateLeaseContractSpreadsheetService } from '../services/create-lease-contract-spreadsheet.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UpdateLeaseContractSpreadsheetService } from '@modules/contract/modules/lease-contract/services/update-lease-contract-spreadsheet.service';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';

import { UserTimezone } from '@modules/shared/decorators/user-timezone.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { Express } from 'express';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Controller('lease-contract/spreadsheet')
@UseGuards(UserAuthGuard)
export class LeaseContractSpreadsheetController {
    constructor(
        private createLeaseContractSpreadsheetService: CreateLeaseContractSpreadsheetService,
        private updateLeaseContractSpreadsheetService: UpdateLeaseContractSpreadsheetService,
        private antivirusService: AntivirusService,
    ) {}

    @Post('verify')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
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
            return await this.createLeaseContractSpreadsheetService.verify(parsedBody, file);
        } else if (parsedBody.method === 'update') {
            return await this.updateLeaseContractSpreadsheetService.verify(parsedBody, file);
        } else {
            throw new NotImplementedException({ message: ERROR_CODES.E033_MethodNotSupportedORProvidedIncorrectly.message() });
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
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
            this.createLeaseContractSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else if (parsedBody.method === 'update') {
            this.updateLeaseContractSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else {
            throw new NotImplementedException({ message: ERROR_CODES.E033_MethodNotSupportedORProvidedIncorrectly.message() });
        }
    }
}
