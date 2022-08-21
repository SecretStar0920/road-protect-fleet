import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Document } from '@modules/shared/models/entities/document.model';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

@Component({
    selector: 'rp-create-document-form-control',
    templateUrl: './create-document-form-control.component.html',
    styleUrls: ['./create-document-form-control.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CreateDocumentFormControlComponent),
            multi: true,
        },
    ],
})
export class CreateDocumentFormControlComponent implements OnInit, ControlValueAccessor {
    @Input() mimeTypes: string[] = []; // @see MimeTypes
    @Input() performOCR: boolean = false; // Should OCR be performed?
    @Input() showSuccess: boolean = true; // Should the success message be shown?

    private _documentId: number;
    get documentId(): number {
        return this._documentId;
    }

    @Input()
    set documentId(value: number) {
        this._documentId = value;
        if (this.onChange) {
            this.onChange(value);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }

    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Output() uploaded = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {}

    writeValue(value: number): void {
        if (value) {
            this.documentId = value;
        }
    }

    onDocumentAdded(state: ElementStateModel<Document>) {
        if (state.hasSucceeded()) {
            this.writeValue(state.successResult().context.documentId);
            this.uploaded.emit(true);
        }
    }
}
