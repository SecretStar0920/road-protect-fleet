import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { CreateOwnershipContractSpreadsheetService } from '../services/create-ownership-contract-spreadsheet.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { Express } from 'express';
import { UpdateOwnershipContractSpreadsheetService } from '@modules/contract/modules/ownership-contract/services/update-ownership-contract-spreadsheet.service';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Controller('ownership-contract/spreadsheet')
@UseGuards(UserAuthGuard)
export class OwnershipContractSpreadsheetController {
    constructor(
        private createOwnershipContractSpreadsheetService: CreateOwnershipContractSpreadsheetService,
        private updateOwnershipContractSpreadsheetService: UpdateOwnershipContractSpreadsheetService,
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
            return await this.createOwnershipContractSpreadsheetService.verify(parsedBody, file);
        } else if (parsedBody.method === 'update') {
            return await this.updateOwnershipContractSpreadsheetService.verify(parsedBody, file);
        } else {
            throw new BadRequestException({ message: ERROR_CODES.E033_MethodNotSupportedORProvidedIncorrectly.message() });
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditVehicles)
    @ApiExcludeEndpoint()
    async upload(@UploadedFile() file: Express.Multer.File, @Body('body') body: string, @UserSocket() socket: DistributedWebsocket) {
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
            this.createOwnershipContractSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else if (parsedBody.method === 'update') {
            this.updateOwnershipContractSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else {
            throw new BadRequestException({ message: ERROR_CODES.E033_MethodNotSupportedORProvidedIncorrectly.message() });
        }
    }
}
