import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-general-form-dropdown',
    templateUrl: './general-form-dropdown.component.html',
    styleUrls: ['./general-form-dropdown.component.less'],
})
export class GeneralFormDropdownComponent implements OnInit, ControlValueAccessor, OnDestroy {
    $destroy = new Subject();

    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input() selector: any;

    @Input() labelKey: string;
    @Input() valueKey: string;

    @Input()
    items: Account[] = [];
    private _selected: number;
    get selected(): number {
        return this._selected;
    }

    @Input()
    set selected(value: number) {
        this._selected = value;
        if (this.onChange) {
            this.onChange(value);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.getAccounts();
    }

    getAccounts() {
        this.store.pipe(select(this.selector), takeUntil(this.$destroy)).subscribe((items: any[]) => {
            this.items = items;
        });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {}

    writeValue(value: number): void {
        if (value) {
            this.selected = value;
        }
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }
}
