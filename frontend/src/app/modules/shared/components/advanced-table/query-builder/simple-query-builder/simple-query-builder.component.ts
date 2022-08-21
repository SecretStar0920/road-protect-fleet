import { Component, OnInit } from '@angular/core';
import { FilterKey, FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { CondOperator } from '@modules/shared/constants/cond-operator.enum';
import { forEach } from 'lodash';

@Component({
    selector: 'rp-simple-query-builder',
    templateUrl: './simple-query-builder.component.html',
    styleUrls: ['./simple-query-builder.component.less'],
})
export class SimpleQueryBuilderComponent implements OnInit {
    visibility = FilterKeyVisibility.Simple;
    filterTypes = FilterKeyType;

    get visibleFilters() {
        return this.query.filterKeys.filter((filter) => filter.visibility >= this.visibility);
    }

    constructor(public query: AdvancedQueryFilterService) {}

    ngOnInit(): void {
        this.query.form.controls.key.valueChanges.subscribe((value) => {
            this.automaticOperatorDetection();
        });
        this.updateInputsWithSameFormControlName();
    }

    // ISSUE: https://stackoverflow.com/questions/49915877/multiple-components-binding-with-the-same-reactive-form-control-update-issue
    private updateInputsWithSameFormControlName() {
        this.query.form.valueChanges.subscribe((value) => {
            forEach(value, (val, key) => {
                this.query.form.get(key).setValue(val, { onlySelf: true, emitEvent: false, emitModelToViewChange: true });
            });
        });
    }

    onAddFilter() {
        // For simple query we clear before re-query
        this.query.onClear({ triggerRefresh: false });

        // Add via service
        this.query.onAddFilter();
    }

    private automaticOperatorDetection() {
        // Default Operator based on type
        let operator: CondOperator;
        const key: FilterKey = this.query.form.controls.key.value;
        const value: FilterKey = this.query.form.controls.value.value;
        if (!key) {
            return;
        }
        if (key.type === FilterKeyType.String) {
            operator = CondOperator.CONTAINS;
        } else if (key.type === FilterKeyType.Dropdown) {
            operator = CondOperator.EQUALS;
        } else if (key.type === FilterKeyType.Number) {
            operator = CondOperator.EQUALS;
        } else if (key.type === FilterKeyType.Date) {
            operator = CondOperator.EQUALS;
        } else if (key.type === FilterKeyType.Boolean) {
            operator = CondOperator.EQUALS;
        } else if (key.type === FilterKeyType.Existence) {
            operator = CondOperator.EQUALS;
        }
        this.query.form.controls.operator.setValue(operator);
    }
}
