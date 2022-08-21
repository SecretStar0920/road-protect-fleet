import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { select, Store } from '@ngrx/store';
import * as accountRelationSelectors from '@modules/account-relation/ngrx/account-relation.selectors';
import { AccountRelationState } from '@modules/account-relation/ngrx/account-relation.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-view-account-relations',
    templateUrl: './view-account-relations.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-account-relations.component.less'],
})
export class ViewAccountRelationsComponent implements OnInit, OnDestroy {
    accountRelations: AccountRelation[];
    getAccountRelationsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor(
        private accountRelationService: AccountRelationApiService,
        public table: GeneralTableService,
        private store: Store<AccountRelationState>,
    ) {
        this.table.options.primaryColumnKey = 'accountRelationId';
        this.table.options.enableRowSelect = false;
        this.table.customColumns = [
            {
                key: 'accountRelationId',
                title: 'id',
            },
            // Add other fields here
        ];
    }

    ngOnInit() {
        if (this.action) {
            this.table.columnActionTemplate = this.action;
        }
        this.getAccountRelations();
    }

    getAccountRelations() {
        this.getAccountRelationsState.submit();
        this.accountRelationService.getAllAccountRelations().subscribe(
            (result) => {
                this.getAccountRelationsState.onSuccess('Successfully retrieved Account Relations', result);
            },
            (error) => {
                this.getAccountRelationsState.onFailure('Failed to retrieve Account Relations', error.error);
            },
        );
        this.store.pipe(select(accountRelationSelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.accountRelations = result;
            this.table.data = this.accountRelations.slice();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
