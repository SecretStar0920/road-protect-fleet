import { Component, Input, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { InfringementTag } from '@modules/shared/models/entities/infringement.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'rp-infringement-tags-dropdown',
    templateUrl: './infringement-tags-dropdown.component.html',
    styleUrls: ['./infringement-tags-dropdown.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InfringementTagsDropdownComponent),
            multi: true,
        },
    ],
})
export class InfringementTagsDropdownComponent implements OnInit, ControlValueAccessor {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    availableTags = Object.keys(InfringementTag)

    @Output() selectedTagsOutput = new EventEmitter<InfringementTag[]>();

    private _selectedTags: InfringementTag[];
    get selectedTags(): InfringementTag[] {
        return this._selectedTags;
    }

    @Input()
    set selectedTags(tags: InfringementTag[]) {
        this._selectedTags = tags;
        this.selectedTagsOutput.emit(tags);

        if (this.onChange) {
            this.onChange(tags);
        }

        if (this.onTouched) {
            this.onTouched();
        }
    }

    constructor() {}

    ngOnInit() {
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {}

    writeValue(tags: InfringementTag[]): void {
        this.selectedTags = tags;
    }
}
