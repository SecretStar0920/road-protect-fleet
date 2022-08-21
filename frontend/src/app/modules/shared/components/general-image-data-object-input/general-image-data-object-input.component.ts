import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-general-image-data-object-input',
    templateUrl: './general-image-data-object-input.component.html',
    styleUrls: ['./general-image-data-object-input.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GeneralImageDataObjectInputComponent),
            multi: true,
        },
    ],
})
export class GeneralImageDataObjectInputComponent implements OnInit, ControlValueAccessor {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;
    isDisabled: boolean = false;

    reader: FileReader;

    imageLoadState = new ElementStateModel();

    @ViewChild('fileInput') fileInput;

    private _value: string;
    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
        if (this.onChange) {
            this.onChange(value);
        }

        if (this.onTouched) {
            this.onTouched();
        }
    }

    constructor() {
        this.reader = new FileReader();
        this.reader.onloadend = (e) => {
            this.value = this.reader.result as string;
            this.imageLoadState.onSuccess('Image uploaded successfully');
        };
    }

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
        this.value = value;
    }

    onClear() {
        // this.signaturePad.clear();
        this.value = null;
    }

    onFileChanged() {
        this.imageLoadState.submit();
        const file: File = this.fileInput.nativeElement.files[0];
        if (!file.type.includes('image')) {
            this.imageLoadState.onFailure('This file does not seem to be an image');
            return;
        }
        if (file.size > 300000) {
            this.imageLoadState.onFailure('This image is too big');
            return;
        }

        if (file) {
            this.reader.readAsDataURL(file);
        }
    }
}
