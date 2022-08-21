import { Injectable } from '@angular/core';
import { AvailableIntegrations } from '@modules/integration-test/models/integration-test.model';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IntegrationTestService {
    constructor(private http: HttpService) {}

    post(integrationName: AvailableIntegrations, dto: any): Observable<any> {
        return this.http.post(`integration/test/${integrationName}`, dto);
    }
}
