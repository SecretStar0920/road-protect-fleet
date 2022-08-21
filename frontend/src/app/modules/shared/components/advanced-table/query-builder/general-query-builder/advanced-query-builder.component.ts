import { Component, OnInit } from '@angular/core';
import { QueryFilter } from '@nestjsx/crud-request';
import { forEach, isEqual, some } from 'lodash';
import { CondOperator, OPERATOR_DISPLAY, TYPE_OPERATORS } from '@modules/shared/constants/cond-operator.enum';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';

@Component({
    selector: 'rp-general-query-builder',
    templateUrl: './advanced-query-builder.component.html',
    styleUrls: ['./advanced-query-builder.component.less'],
})
export class AdvancedQueryBuilderComponent implements OnInit {
    visibility = FilterKeyVisibility.Simple;

    get visibleFilters() {
        return this.query.filterKeys.filter((filter) => filter.visibility >= this.visibility);
    }

    operators = CondOperator;
    typeOperators = TYPE_OPERATORS;
    operatorDisplay = OPERATOR_DISPLAY;
    filterTypes = FilterKeyType;

    constructor(public query: AdvancedQueryFilterService) {}

    ngOnInit() {
        // this.updateInputsWithSameFormControlName();
    }

    // ISSUE: https://stackoverflow.com/questions/49915877/multiple-components-binding-with-the-same-reactive-form-control-update-issue
    private updateInputsWithSameFormControlName() {
        this.query.form.valueChanges.subscribe((value) => {
            forEach(value, (val, key) => {
                this.query.form.get(key).setValue(val, { onlySelf: true, emitEvent: false, emitModelToViewChange: true });
            });
        });
    }

    isNotFixedFilter(filter: QueryFilter) {
        return !some(this.query.fixedFilters, (fixedFilter) => isEqual(filter, fixedFilter));
    }
}
