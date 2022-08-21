import { RawInfringement } from '@entities';
import { HttpException } from '@nestjs/common';

export class InfringementVerificationException extends HttpException {
    constructor(rawInfringement: RawInfringement) {
        const statusCode = rawInfringement.result?.status ? rawInfringement.result.status : 500;
        const message = rawInfringement.result?.message ? rawInfringement.result.message : `Failed to verify infringement`;
        super(message, statusCode);
    }
}
