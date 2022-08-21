import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntitySpreadsheetUpload } from '@modules/shared/models/entity-spreadsheet.upload';
import { SentenceCasePipe } from '@modules/shared/pipes/sentence-case.pipe';
import { SpreadsheetMetadataParams } from '@modules/shared/dtos/spreadsheet-config';
import i18next from 'i18next';
import { startCase } from 'lodash';

@Component({
    selector: 'rp-excel-column-mapper',
    templateUrl: './excel-column-mapper.component.html',
    styleUrls: ['./excel-column-mapper.component.less'],
})
export class ExcelColumnMapperComponent implements OnInit {
    columnsMappedSuccessfully: boolean;
    get entityUpload(): EntitySpreadsheetUpload<any> {
        return this._entityUpload;
    }

    @Input()
    set entityUpload(value: EntitySpreadsheetUpload<any>) {
        this._entityUpload = value;
        this.setDefaultMapping();
    }
    private _entityUpload: EntitySpreadsheetUpload<any>;

    private _sheetHeadings: string[] = [];
    get sheetHeadings(): string[] {
        return this._sheetHeadings;
    }

    @Input()
    set sheetHeadings(value: string[]) {
        this._sheetHeadings = value;
        this.setDefaultMapping();
    }

    @Output() mappedHeadingsChange: EventEmitter<{ [key: string]: string }> = new EventEmitter<{ [key: string]: string }>();
    mappedHeadings: { [key: string]: string } = {};

    constructor() {}

    ngOnInit() {}

    /**
     * Update the map
     */
    mapHeading(spreadsheetHeading: string, field: string) {
        if (spreadsheetHeading) {
            this.mappedHeadings[field] = spreadsheetHeading;
        } else {
            delete this.mappedHeadings[field];
        }
        this.mappedHeadingsChange.emit(this.mappedHeadings);
    }

    /**
     * Naively assumes order is the same on selection as spreadsheet heading
     */
    setDefaultMapping() {
        const mapping = {};
        const fields = this._entityUpload.currentOption.orderedFields;
        if (!this.sheetHeadings) {
            return;
        }

        this.columnsMappedSuccessfully = false;
        this.setExactColumnMapping(mapping, fields);
        if (!this.columnsMappedSuccessfully) {
            this.setLeftToRightMapping(mapping, fields);
        }
        this.mappedHeadings = mapping;
        this.mappedHeadingsChange.emit(this.mappedHeadings);
    }

    setExactColumnMapping(mapping: {}, fields: SpreadsheetMetadataParams[]) {
        for (let i = 0; i < this._sheetHeadings.length; i++) {
            for (const item of fields) {
                let spreadSheetHeading = this._sheetHeadings[i];

                /** Removing the '*' so that we can effectively match spreadsheet headings against what's stored in the translation headings.
                 *  We begin at index 2 in the substring function because when the '*' was appended, they included a space right after the '*'
                 *  * i.e the string was 'Notice Number' after the '*' was appended, the string became '* Notice Number'
                 */
                if (spreadSheetHeading.includes('*')) {
                    spreadSheetHeading = spreadSheetHeading.substring(2, spreadSheetHeading.length);
                }
                if (
                    spreadSheetHeading.toLowerCase().localeCompare(startCase(`${item.key as string}`).toLowerCase()) === 0 ||
                    spreadSheetHeading.toLowerCase().localeCompare(i18next.t(item.label).toLowerCase()) === 0
                ) {
                    mapping[item.key] = this._sheetHeadings[i];
                    this.columnsMappedSuccessfully = true;
                    break;
                }
            }
        }
    }
    setLeftToRightMapping(mapping: {}, fields: SpreadsheetMetadataParams[]) {
        for (let i = 0; i < this._sheetHeadings.length; i++) {
            mapping[fields[i].key] = this._sheetHeadings[i];
        }
    }
}
