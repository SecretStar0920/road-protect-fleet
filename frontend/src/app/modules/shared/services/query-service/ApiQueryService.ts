import { HttpService } from '@modules/shared/services/http/http.service';
import { Observable } from 'rxjs';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

export abstract class ApiQueryService<T> {
    protected constructor(protected http: HttpService) {}

    abstract query(query: string): Observable<PaginationResponseInterface<T>>;
    abstract queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }>;
}
