import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { vehicleCategories } from '@modules/shared/constants/vehicle-categories';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'rp-vehicle-category-autocomplete',
    templateUrl: './vehicle-category-autocomplete.component.html',
    styleUrls: ['./vehicle-category-autocomplete.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VehicleCategoryAutocompleteComponent),
            multi: true,
        },
    ],
})
export class VehicleCategoryAutocompleteComponent implements OnInit, ControlValueAccessor {
    categories: string[] = vehicleCategories;
    filteredCategories: string[] = vehicleCategories;

    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input() isDisabled: boolean = false;

    private _selectedCategory: string;
    get selectedCategory(): string {
        return this._selectedCategory;
    }

    @Input()
    set selectedCategory(value: string) {
        this._selectedCategory = value;
        this.onSearch(value);
        if (this.onChange) {
            this.onChange(value);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }

    constructor() {}

    ngOnInit() {
        this.getCategorys();
    }

    getCategorys() {
        // TODO: Implement
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    writeValue(value: string): void {
        if (value) {
            this.selectedCategory = value;
        }
    }

    onSearch(value: string): void {
        this.filteredCategories = this.categories.filter((option) => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
}
