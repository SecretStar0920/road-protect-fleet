import { Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    AdvancedFilterTableService,
    AdvancedTableColumn,
} from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Observable, of } from 'rxjs';
import { PartialInfringement, PartialInfringementStatus } from '@modules/shared/models/entities/partial-infringement.model';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import i18next from 'i18next';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { Store } from '@ngrx/store';
import {
    partialInfringementNgrxHelper,
    PartialInfringementState,
} from '@modules/admin-partial-infringement/ngrx/partial-infringement.reducer';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { tap } from 'rxjs/operators';


@Injectable()
class PartialInfringementProvider extends ApiQueryService<PartialInfringement> {

    private readonly defaultLimit = 10;
    private infringements: PartialInfringement[] = [];

    constructor(http: HttpService, private store: Store<PartialInfringementState>) {
        super(http);
    }

    updateInfringements(infringements: PartialInfringement[]) {
        this.infringements = infringements;
    }

    query(query: string): Observable<PaginationResponseInterface<PartialInfringement>> {
        const paramsMap = this.parseQuery(query);

        let limit = parseInt(paramsMap.get('limit'));
        if (isNaN(limit)) {
            limit = this.defaultLimit;
        }

        limit = Math.max(1, limit);

        let page = parseInt(paramsMap.get('page'));
        if (isNaN(page)) {
            page = 1;
        } else {
            page = Math.max(1, Math.min(this.pageCount(limit), page));
        }

        const from = (page - 1) * limit;
        const resultInfringements = [];
        for (let i = from; i < from + limit && i < this.infringements.length; i++) {
            resultInfringements.push(this.infringements[i])
        }

        const result = {
            data: resultInfringements,
            count: resultInfringements.length,
            total: this.infringements.length,
            page: page,
            pageCount: this.pageCount(limit)
        };

        return of(result).pipe(tap((partialInfringementPaginated) => {
            this.store.dispatch(partialInfringementNgrxHelper.loadPage({ items: partialInfringementPaginated.data }));
        }));
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return undefined;
    }

    private pageCount(limit: number): number {
        if (limit <= 0) {
            limit = this.defaultLimit
        }

        return Math.ceil(this.infringements.length / limit)
    }

    private parseQuery(query): Map<string, string> {
        const components = query.split('&');
        const paramsMap = new Map<string, string>();

        components.forEach((component) => {
            const nameAndVal = component.split('=');
            if (nameAndVal.length === 2) {
                const [name, val] = nameAndVal
                paramsMap.set(name, val)
            }
        })

        return paramsMap
    }
}

@Component({
    selector: 'view-ocr-partial-infringements',
    templateUrl: './view-ocr-partial-infringements.component.html',
    styleUrls: ['./view-ocr-partial-infringements.component.less'],

    providers: [
        AdvancedFilterTableService,
        AdvancedQueryFilterService,
        { provide: ApiQueryService, useClass: PartialInfringementProvider },
    ],
})
export class ViewOcrPartialInfringementsComponent implements OnInit {

    @ViewChild('createdAt', { static: true }) createdAtTemplate: TemplateRef<any>;
    @ViewChild('status', { static: true }) statusTemplate: TemplateRef<any>;
    @ViewChild('noticeNumber', { static: true }) noticeNumberTemplate: TemplateRef<any>;
    @ViewChild('processedDate', { static: true }) processedDateTemplate: TemplateRef<any>;
    @ViewChild('formattedDetails', { static: true }) formattedDetailsTemplate: TemplateRef<any>;

    private readonly infringementsProvider: PartialInfringementProvider
    constructor(
        protected readonly table: AdvancedFilterTableService,
        protected readonly query: AdvancedQueryFilterService,
        private readonly store: Store<PartialInfringementState>,
        apiQueryService: ApiQueryService<PartialInfringement>,
    ) {
        table.options.enableExport = false;
        table.options.enableAdvancedFilters = false;
        table.options.enableStandardFilters = false;
        table.options.enableColumnFilter = true;

        this.infringementsProvider = apiQueryService as PartialInfringementProvider;
        this.configureTable();
    }

    private configureTable() {
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.partialInfringementTable }));
        this.table.ngrxHelper = partialInfringementNgrxHelper;

        this.table.options.primaryColumnKey = 'noticeNumber';
        this.table.options.enableRowSelect = false;

        this.table.defaultColumns = [
            {
                key: 'partialInfringementId',
                title: i18next.t('partial-infringement.id'),
            },
            {
                key: 'createdAt',
                title: i18next.t('partial-infringement.created_at'),
            },
            {
                key: 'formattedDetails',
                title: i18next.t('partial-infringement.details'),
            },
            {
                key: 'noticeNumber',
                title: i18next.t('partial-infringement.notice_number'),
            },
            {
                key: 'status',
                title: i18next.t('partial-infringement.status'),
            },
            {
                key: 'processedDate',
                title: i18next.t('partial-infringement.processed_date'),
            }
        ];

        this.query.filterKeys = [
            {
                key: 'noticeNumber',
                display: i18next.t('partial-infringement.notice_number'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'partialInfringement',
                searchField: 'noticeNumber',
            },
            {
                key: 'createdAt',
                display: i18next.t('partial-infringement.created_at'),
                type: FilterKeyType.Date,
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'status',
                display: i18next.t('raw-infringement-log.status'),
                type: FilterKeyType.Dropdown,
                visibility: FilterKeyVisibility.Simple,
                options: Object.values(PartialInfringementStatus),
            },
            {
                key: 'processedDate',
                display: i18next.t('partial-infringement.processed_date'),
                type: FilterKeyType.Date,
                visibility: FilterKeyVisibility.Simple,
            },
        ];
    }

    ngOnInit(): void {
        this.table.templateColumns = {
            createdAt: this.createdAtTemplate,
            formattedDetails: this.formattedDetailsTemplate,
            status: this.statusTemplate,
            noticeNumber: this.noticeNumberTemplate,
            processedDate: this.processedDateTemplate,
        };

        this.table.selectDataFromStore();
    }

    updateInfringements(infringements: PartialInfringement[]) {
        this.infringementsProvider.updateInfringements(infringements);
        this.query.refreshData();
    }

    processedStatus(status: PartialInfringementStatus) {
        return !(status === PartialInfringementStatus.Pending || status === PartialInfringementStatus.Queued);
    }

}
