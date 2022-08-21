import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AutocompleteService {
    constructor(private http: HttpService) {}

    search(entity: string, field: string, search: string): Observable<string[]> {
        return this.http.getSecure(`autocomplete/${entity}/${field}/${search}`);
    }
}
