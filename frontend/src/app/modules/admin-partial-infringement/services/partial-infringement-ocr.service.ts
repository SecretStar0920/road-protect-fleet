import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import { UploadOcrPartialInfringementDto } from '@modules/admin-partial-infringement/services/upload-ocr-partial-infringement.dto';

export class UploadOcrPartialInfringementResponse {
    valid: PartialInfringement[];
    invalid: PartialInfringement[];
}

@Injectable({
    providedIn: 'root',
})
export class PartialInfringementOcrService {
    constructor(private http: HttpService) {
    }

    upload(uploadDto: UploadOcrPartialInfringementDto, file: File): Observable<UploadOcrPartialInfringementResponse> {
        return this.http.uploadFile('partial-infringement/ocr/upload', file, uploadDto);
    }
}
