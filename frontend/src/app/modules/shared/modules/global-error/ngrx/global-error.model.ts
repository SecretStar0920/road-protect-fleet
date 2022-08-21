import { HttpErrorResponse } from '@angular/common/http';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { Moment } from 'moment';

export class GlobalError {
    id: string = v4();
    raw: HttpErrorResponse;
    acknowledged: boolean = false;
    timestamp: Moment = moment();

    constructor(error: HttpErrorResponse) {
        this.raw = error;
    }
}
