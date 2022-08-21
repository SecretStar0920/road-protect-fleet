import { Component, ElementRef, forwardRef, OnInit, ViewChild } from '@angular/core';
import { isNil } from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

@Component({
    selector: 'rp-general-signature-input',
    templateUrl: './general-signature-input.component.html',
    styleUrls: ['./general-signature-input.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GeneralSignatureInputComponent),
            multi: true,
        },
    ],
})
export class GeneralSignatureInputComponent implements OnInit, ControlValueAccessor {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;
    isDisabled: boolean = false;

    signaturePad: SignaturePad;

    reader: FileReader;
    @ViewChild('fileInput') fileInput;
    imageLoadState = new ElementStateModel();

    wasRestored: boolean = false;

    private _canvas: ElementRef<HTMLCanvasElement>;
    get canvas(): ElementRef<HTMLCanvasElement> {
        return this._canvas;
    }

    @ViewChild('signatureBlock')
    set canvas(value: ElementRef<HTMLCanvasElement>) {
        this._canvas = value;
        this.signaturePad = new SignaturePad(this._canvas.nativeElement);
        this.signaturePad.onEnd = () => this.onSave();
        this.signaturePad.onBegin = () => {};

        if (this.signaturePad.isEmpty() && !isNil(this.value) && this.value !== '') {
            this.signaturePad.fromDataURL(this.value);
            this.wasRestored = true;
        }
    }

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
            this.signaturePad.clear();
            this.signaturePad.fromDataURL(this.value);
            this.wasRestored = true;
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
        this.signaturePad.clear();
        this.value = null;
    }

    onSave() {
        this.value = this.signaturePad.toDataURL('image/svg+xml');
        console.log(this.signaturePad.toDataURL('image/svg+xml'));
    }

    ////////////////////////////////////////////////////////////////
    // Signature Upload
    ///////////////////////////////////////////////////////////////

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

    checkRestored() {
        if (this.wasRestored) {
            this.signaturePad.clear();
            this.wasRestored = false;
        }
    }
}
