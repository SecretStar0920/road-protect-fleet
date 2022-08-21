import { forEach, isNil } from 'lodash';
import { GeneratedDocument } from '~/models/generated-document.model';

export class DocumentTemplateForm {
    language: 'he' | 'en' = 'he';
    fields: {
        [key: string]: DocumentTemplateField;
    };
    fieldOrder: string[];

    isValid() {
        let valid = true;
        forEach(this.fields, (val, key) => {
            if (!val.validate()) {
                valid = false;
            }
        });
        return valid;
    }

    constructor(obj: any = {}) {
        this.fields = obj.fields || {};
        this.fieldOrder = obj.fieldOrder || [];
    }
}

export enum DocumentTemplateFieldTypes {
    Text = 'Text',
    Signature = 'Signature',
    Date = 'Date',
    Image = 'Image',
}

export class FieldAutoFillOptions {
    enabled: boolean;
    fromBaseEntity: string;
    withPath: string;

    constructor(obj: any = {}) {
        this.enabled = obj.enabled || false;
        this.fromBaseEntity = obj.fromBaseEntity;
        this.withPath = obj.withPath;
    }
}
export abstract class DocumentTemplateField {
    abstract type: DocumentTemplateFieldTypes;

    autofill: FieldAutoFillOptions;
    value: string;
    required: boolean;
    label: string;

    validate(): boolean {
        return !(this.required && isNil(this.value));
    }

    constructor(obj: any = {}) {
        const value = obj.value === undefined ? '' : obj.value;
        const required = obj.required === undefined ? true : obj.required;
        this.autofill = obj.autofill || new FieldAutoFillOptions({});
        this.value = value;
        this.required = required || true;
        this.label = obj.label;
    }
}

export class TextField extends DocumentTemplateField {
    type = DocumentTemplateFieldTypes.Text;

    validate(): boolean {
        return super.validate();
    }
}

export class SignatureField extends DocumentTemplateField {
    type = DocumentTemplateFieldTypes.Signature;

    validate(): boolean {
        return super.validate();
    }
}

export class DateField extends DocumentTemplateField {
    type = DocumentTemplateFieldTypes.Date;

    validate(): boolean {
        return super.validate();
    }
}

export class ImageField extends DocumentTemplateField {
    type = DocumentTemplateFieldTypes.Image;

    validate(): boolean {
        return super.validate();
    }
}

export class DocumentTemplate {
    documentTemplateId!: number;
    name!: string;
    url!: string;
    language: 'he' | 'en' = 'he';

    form!: DocumentTemplateForm;

    generatedDocuments!: GeneratedDocument[];
}
