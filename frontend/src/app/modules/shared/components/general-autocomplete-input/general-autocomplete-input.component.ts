import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { AutocompleteService } from '@modules/shared/services/autocomplete/autocomplete.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'rp-general-autocomplete-input',
    templateUrl: './general-autocomplete-input.component.html',
    styleUrls: ['./general-autocomplete-input.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GeneralAutocompleteInputComponent),
            multi: true,
        },
    ],
})
export class GeneralAutocompleteInputComponent implements OnInit, ControlValueAccessor {
    options: string[] = [];

    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input() isDisabled: boolean = false;

    @Input() entity: string;
    @Input() field: string;
    @Input() placeholder: string = '';

    search: Subject<string> = new Subject<string>();

    private _selectedOption: string;
    get selectedOption(): string {
        return this._selectedOption;
    }

    @Input()
    set selectedOption(value: string) {
        this._selectedOption = value;
        this.onSearch(value);
        if (this.onChange) {
            this.onChange(value);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }

    constructor(private autocompleteService: AutocompleteService) {}

    onSearch($event) {
        const search = $event;
        this.search.next(search);
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
        this.selectedOption = value;
    }

    ngOnInit(): void {
        this.search.pipe(debounceTime(300), distinctUntilChanged()).subscribe((result) => {
            if (isEmpty(result)) {
                this.options = [];
                return;
            }
            this.autocompleteService.search(this.entity, this.field, result).subscribe((options) => {
                this.options = options;
            });
        });
    }
}
