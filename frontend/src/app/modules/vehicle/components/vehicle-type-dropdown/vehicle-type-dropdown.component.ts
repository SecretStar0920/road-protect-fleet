import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { VehicleType } from '@modules/shared/models/entities/vehicle.model';

@Component({
    selector: 'rp-vehicle-type-dropdown',
    templateUrl: './vehicle-type-dropdown.component.html',
    styleUrls: ['./vehicle-type-dropdown.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VehicleTypeDropdownComponent),
            multi: true,
        },
    ],
})
export class VehicleTypeDropdownComponent implements OnInit {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    types = Object.values(VehicleType as any);

    isDisabled = false;

    private _selectedType: string;
    get selectedType(): string {
        return this._selectedType;
    }

    @Input()
    set selectedType(value: string) {
        this._selectedType = value;

        if (this.onChange) {
            this.onChange(value);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }

    constructor() {}

    ngOnInit() {}

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
        this.selectedType = value;
    }
}
