import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNil } from 'lodash';

export interface IBetween {
    min: string | number;
    max: string | number;
}

@Component({
    selector: 'rp-general-between-input',
    templateUrl: './general-between-input.component.html',
    styleUrls: ['./general-between-input.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GeneralBetweenInputComponent),
            multi: true,
        },
    ],
})
export class GeneralBetweenInputComponent implements OnInit, ControlValueAccessor {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;
    isDisabled: boolean = false;

    @Input() inputType: 'text' | 'number' = 'text';
    @Input() isCompact: boolean = false;

    private _value: IBetween = {
        min: null,
        max: null,
    };
    get value(): IBetween {
        return this._value;
    }

    set value(value: IBetween) {
        if (isNil(value)) {
            value = {
                min: null,
                max: null,
            };
        }
        this._value = value;
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

    writeValue(value: IBetween): void {
        this.value = value;
    }
}
