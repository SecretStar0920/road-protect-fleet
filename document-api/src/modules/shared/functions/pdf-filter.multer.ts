import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export function pdfFilter(req: Request, file, cb) {
    if (file.mimetype !== 'application/pdf') {
        return cb(new BadRequestException('Not a pdf'), false);
    }

    return cb(null, true);
}
