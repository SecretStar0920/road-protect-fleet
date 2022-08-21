import { Entity } from '@modules/shared/models/timestamped';
import { SpreadsheetService } from '@modules/shared/services/spreadsheet-service/spreadsheet.service';
import { GetSpreadsheetConfig, HasSpreadsheetConfig, SpreadsheetMetadataParams } from '@modules/shared/dtos/spreadsheet-config';
import { sortBy, startCase } from 'lodash';
import i18next from 'i18next';

export class UploadOption {
    dto: any;
    service: SpreadsheetService;
    public config: { [field: string]: SpreadsheetMetadataParams } = {};
    public orderedFields: SpreadsheetMetadataParams[];

    public spreadsheetHeadings: string[];

    /**
     * Use i18next to convert the value of the label into the heading that should
     * be in the spreadsheet. For instance if your label is 'address.city' the
     * results would be the following:
     *
     * useTranslationForHeading = false   ===> 'Address City'
     * useTranslationForHeading = true    ===> 'City' (or Hebrew alternative)
     * @private
     */
    private readonly useTranslationForHeading: boolean;

    constructor(obj: { dto: any; service: SpreadsheetService; useTranslationForHeading?: boolean }) {
        this.dto = obj.dto;
        this.service = obj.service;
        // I want this to default to true
        this.useTranslationForHeading = !(obj.useTranslationForHeading === false);
        const constructed = new this.dto();
        if (HasSpreadsheetConfig(constructed)) {
            this.config = GetSpreadsheetConfig(constructed);
        } else {
            throw new Error('Dto does not have spreadsheet config metadata');
        }

        this.initSpreadsheetHeadings();
        this.initOrderedFields();
    }

    /**
     * Returns an array of formatted strings for the spreadsheet templates
     */
    initSpreadsheetHeadings(): void {
        const values = sortBy(Object.values(this.config), (o) => o.order);
        const headings = values.map((value) => {
            let heading = '';

            if (value.required) {
                heading += '* ';
            }

            heading += this.useTranslationForHeading && value.label ? i18next.t(value.label) : startCase(`${value.key as string}`);

            return heading;
        }) as string[];
        this.spreadsheetHeadings = headings || [];
    }

    initOrderedFields(): void {
        this.orderedFields = sortBy(Object.values(this.config), (o) => o.order);
    }
}

export class EntitySpreadsheetUpload<T extends Entity> {
    public entityName: string;

    public methods: string[];
    public currentMethod: string;

    public options: { [method: string]: UploadOption };

    get currentOption(): UploadOption {
        return this.options[this.currentMethod];
    }

    constructor(entityName: string, options: { [method: string]: UploadOption }, methods: string[]) {
        this.methods = methods;
        this.entityName = entityName;
        this.options = options;
        this.currentMethod = methods[0];
    }
}
