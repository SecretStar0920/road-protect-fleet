import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { vehicleManufacturers } from '@modules/shared/constants/vehicle-manufacturers';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'rp-vehicle-manufacturer-autocomplete',
    templateUrl: './vehicle-manufacturer-autocomplete.component.html',
    styleUrls: ['./vehicle-manufacturer-autocomplete.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VehicleManufacturerAutocompleteComponent),
            multi: true,
        },
    ],
})
export class VehicleManufacturerAutocompleteComponent implements OnInit, ControlValueAccessor {
    manufacturers: string[] = vehicleManufacturers;
    filteredManufacturers: string[] = vehicleManufacturers;

    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input() isDisabled: boolean = false;

    private _selectedManufacturer: string;
    get selectedManufacturer(): string {
        return this._selectedManufacturer;
    }

    @Input()
    set selectedManufacturer(value: string) {
        this._selectedManufacturer = value;
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
        this.getManufacturers();
    }

    getManufacturers() {
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
            this.selectedManufacturer = value;
        }
    }

    onSearch(value: string): void {
        this.filteredManufacturers = this.manufacturers.filter((option) => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
}
