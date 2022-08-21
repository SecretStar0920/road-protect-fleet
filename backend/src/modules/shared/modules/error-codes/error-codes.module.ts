import { Module } from '@nestjs/common';
import { ErrorCodesController } from './error-codes.controller';
import { ErrorCodesService } from './error-codes.service';

@Module({
    controllers: [ErrorCodesController],
    providers: [ErrorCodesService],
})
export class ErrorCodesModule {}
