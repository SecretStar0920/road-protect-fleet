import { HttpException } from '@nestjs/common';

export class VirusFoundException extends HttpException {
    constructor() {
        super(`Malicious file detected!`, 500);
    }
}
