import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { GeneratedDocument, TimeStamped } from '@entities';
import { forEach, isNil } from 'lodash';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { ApiProperty } from '@nestjs/swagger';

export class DocumentTemplateForm {
    @ApiProperty()
    language: 'he' | 'en' = 'he';
    @ApiProperty({ type: 'object', description: 'DocumentTemplateField[]' })
    fields: {
        [key: string]: DocumentTemplateField;
    };
    @ApiProperty()
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
    @ApiProperty()
    enabled: boolean;
    @ApiProperty()
    fromBaseEntity: string;
    @ApiProperty()
    withPath: string;

    constructor(obj: any = {}) {
        this.enabled = obj.enabled || false;
        this.fromBaseEntity = obj.fromBaseEntity;
        this.withPath = obj.withPath;
    }
}
export abstract class DocumentTemplateField {
    @ApiProperty()
    abstract type: DocumentTemplateFieldTypes;

    @ApiProperty({ type: () => FieldAutoFillOptions })
    autofill: FieldAutoFillOptions;
    @ApiProperty()
    value: string;
    @ApiProperty()
    required: boolean;
    @ApiProperty()
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
    @ApiProperty({ default: DocumentTemplateFieldTypes.Text })
    type = DocumentTemplateFieldTypes.Text;

    validate(): boolean {
        return super.validate();
    }
}

export class SignatureField extends DocumentTemplateField {
    @ApiProperty({ default: DocumentTemplateFieldTypes.Signature })
    type = DocumentTemplateFieldTypes.Signature;

    validate(): boolean {
        return super.validate();
    }
}

export class DateField extends DocumentTemplateField {
    @ApiProperty({ default: DocumentTemplateFieldTypes.Date })
    type = DocumentTemplateFieldTypes.Date;

    validate(): boolean {
        return super.validate();
    }
}

export class ImageField extends DocumentTemplateField {
    @ApiProperty({ default: DocumentTemplateFieldTypes.Image })
    type = DocumentTemplateFieldTypes.Image;

    validate(): boolean {
        return super.validate();
    }
}

export const DOCUMENT_TEMPLATE_CONSTRAINTS: IDatabaseConstraints = {
    single_per_type: {
        keys: ['name', 'url', 'lang'],
        constraint: 'unique_lang_docs',
        description: 'An document already exists for this language',
    },
};

@Entity()
@Unique(DOCUMENT_TEMPLATE_CONSTRAINTS.single_per_type.constraint, DOCUMENT_TEMPLATE_CONSTRAINTS.single_per_type.keys)
export class DocumentTemplate extends TimeStamped {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    documentTemplateId: number;

    @Column('enum', { enum: ['en', 'he'], default: 'he' })
    @ApiProperty({ enum: ['en', 'he'], default: 'he' })
    lang: string;

    @Column('text')
    @ApiProperty()
    name: string;

    @Column('text')
    @ApiProperty()
    url: string;

    @Column('jsonb')
    @ApiProperty({ type: 'object', description: 'DocumentTemplateForm' })
    form: DocumentTemplateForm;

    @OneToMany((type) => GeneratedDocument, (generatedDocument) => generatedDocument.documentTemplate)
    @ApiProperty({ type: 'object', description: 'GeneratedDocument[]' })
    generatedDocuments: GeneratedDocument[];

    static findByName(name: string) {
        return this.createQueryBuilder('template').where('template.name = :name', { name });
    }
}
