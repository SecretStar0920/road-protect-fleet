import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InfringementType } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-infringement-type-dropdown',
    templateUrl: './infringement-type-dropdown.component.html',
    styleUrls: ['./infringement-type-dropdown.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InfringementTypeDropdownComponent),
            multi: true,
        },
    ],
})
export class InfringementTypeDropdownComponent implements OnInit, ControlValueAccessor {
    infringementTypes = Object.values(InfringementType);

    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;
    @Input() isDisabled: boolean = false;

    _selectedType: InfringementType = InfringementType.Traffic;
    get selectedType(): InfringementType {
        return this._selectedType;
    }

    @Input()
    set selectedType(value: InfringementType) {
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

    writeValue(value: InfringementType): void {
        if (value) {
            this.selectedType = value;
        }
    }
}
