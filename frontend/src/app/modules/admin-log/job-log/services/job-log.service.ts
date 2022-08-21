import { Injectable } from '@angular/core';
import { jobLogNgrxHelper, JobLogState } from '@modules/admin-log/job-log/ngrx/job-log.reducer';
import { JobLog } from '@modules/shared/models/entities/job-log.model';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class JobLogService {
    constructor(private http: HttpService, private store: Store<JobLogState>) {}

    getAllJobLogs() {
        return this.http.getSecure('jobLog').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(JobLog, item));
                }
                return [];
            }),
            tap((jobLogs) => {
                this.store.dispatch(jobLogNgrxHelper.load({ items: jobLogs }));
            }),
        );
    }

    getJobLog(jobLogUuid: string) {
        return this.http.getSecure(`job/${jobLogUuid}`).pipe(
            map((response: object) => {
                return plainToClass(JobLog, response);
            }),
            tap((jobLog) => {
                this.store.dispatch(jobLogNgrxHelper.upsertOne({ item: jobLog }));
            }),
        );
    }
}
