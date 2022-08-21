import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { validatorExceptionFactory } from '@modules/shared/helpers/validator-exception-factory.helper';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Express } from 'express';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { CreatePartialInfringementOcrService } from '@modules/partial-infringement/services/create-partial-infringement-ocr.service';
import { UploadOcrPartialInfringementsResponse } from '@modules/partial-infringement/dtos/upload-ocr-partial-infringements-response';
import { UploadOcrPartialInfringementsDto } from '@modules/partial-infringement/dtos/upload-ocr-partial-infringements.dto';

@Controller('partial-infringement/ocr')
@UseGuards(UserAuthGuard)
export class PartialInfringementOcrController {
    constructor(
        private createPartialInfringementOcrService: CreatePartialInfringementOcrService
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('body') body: string,
        @UserSocket() socket: DistributedWebsocket): Promise<UploadOcrPartialInfringementsResponse> {

        const ocrUpload: UploadOcrPartialInfringementsDto = plainToClass(UploadOcrPartialInfringementsDto, JSON.parse(body) as object);
        const validationErrors = await validate(ocrUpload);
        if (!isEmpty(validationErrors)) {
            throw new BadRequestException({
                message: ERROR_CODES.E030_InvalidUploadedData.message(),
                error: validatorExceptionFactory(validationErrors),
            });
        }

        const result = this.createPartialInfringementOcrService.upload(ocrUpload, file, socket);
        return result

    }

}
