import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IssuerProviderType } from '@modules/shared/models/entities/issuer-integration-details.model';

@Component({
    selector: 'rp-issuer-providers-dropdown',
    templateUrl: './issuer-providers-dropdown.component.html',
    styleUrls: ['./issuer-providers-dropdown.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IssuerProvidersDropdownComponent),
            multi: true,
        },
    ],
})
export class IssuerProvidersDropdownComponent implements OnInit, ControlValueAccessor {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input()
    providers = Object.values(IssuerProviderType);
    private _selectedProvider: IssuerProviderType;
    get selectedProvider(): IssuerProviderType {
        return this._selectedProvider;
    }

    @Input()
    set selectedProvider(value: IssuerProviderType) {
        this._selectedProvider = value;
        if (value) {
            this.selectedProviderType.emit(value);
        }
        if (this.onChange) {
            this.onChange(value);
            this.onTouched();
        }
    }

    @Output() selectedProviderType = new EventEmitter<IssuerProviderType>();

    constructor() {}

    ngOnInit() {}

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {}

    writeValue(value: IssuerProviderType): void {
        if (value) {
            this.selectedProvider = value;
        }
    }
}
