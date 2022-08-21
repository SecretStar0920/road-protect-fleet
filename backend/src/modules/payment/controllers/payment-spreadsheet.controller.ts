import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { IsDefined, IsOptional, IsString, validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpreadsheetUploadCompleteResponse } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { plainToClass, Transform } from 'class-transformer';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { isEmpty } from 'lodash';
import { validatorExceptionFactory } from '@modules/shared/helpers/validator-exception-factory.helper';
import { CreateManualPaymentSpreadsheetService } from '@modules/payment/services/create-manual-payment-spreadsheet.service';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';

import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { asCurrency } from '@modules/shared/helpers/dto-transforms';
import { Express } from 'express';
import { CreateOwnershipContractSpreadsheetService } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract-spreadsheet.service';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class UploadManualProofOfPaymentDto {
    @IsDefined()
    @IsString()
    @Transform((val) => `${val}`)
    noticeNumber: string;

    @IsDefined()
    @IsString()
    issuer: string;

    @IsDefined()
    @IsString()
    @Transform((val) => `${val}`)
    referenceNumber: string;

    @IsOptional()
    @Transform((val) => asCurrency(val))
    amountPaid: string;
}

@Controller('payment/spreadsheet')
@UseGuards(UserAuthGuard)
export class PaymentSpreadsheetController {
    constructor(
        private createManualPaymentSpreadsheetService: CreateManualPaymentSpreadsheetService,
        private antivirusService: AntivirusService,
    ) {}

    @Post('verify')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.PayInfringement)
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

        if (parsedBody.method === 'uploadManualProof') {
            return await this.createManualPaymentSpreadsheetService.verify(parsedBody, file);
        } else {
            throw new BadRequestException({ message: ERROR_CODES.E033_MethodNotSupportedORProvidedIncorrectly.message() });
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.PayInfringement)
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

        if (parsedBody.method === 'uploadManualProof') {
            this.createManualPaymentSpreadsheetService.upload(parsedBody, file, socket).catch((e) => {
                throw e;
            });
        } else {
            throw new BadRequestException({ message: ERROR_CODES.E033_MethodNotSupportedORProvidedIncorrectly.message() });
        }
    }
}
