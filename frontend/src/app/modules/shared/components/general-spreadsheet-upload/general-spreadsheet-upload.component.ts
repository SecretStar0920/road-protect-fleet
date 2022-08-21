import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MIME_TYPES } from '@modules/shared/constants/mime-types';
import { FileItem } from 'ng2-file-upload';
import * as XLSX from 'xlsx';
import { WorkBook } from 'xlsx';
import { GeneralFileUploadComponent } from '@modules/shared/components/general-file-upload/general-file-upload.component';
import { ExcelColumnMapperComponent } from '@modules/shared/components/excel-column-mapper/excel-column-mapper.component';
import { EntitySpreadsheetUpload } from '@modules/shared/models/entity-spreadsheet.upload';
import { FileUploadData } from '@modules/infringement/ngrx/file-upload-data.interface';

@Component({
    selector: 'rp-general-spreadsheet-upload',
    templateUrl: './general-spreadsheet-upload.component.html',
    styleUrls: ['./general-spreadsheet-upload.component.less'],
})
export class GeneralSpreadsheetUploadComponent implements OnInit {
    mimeTypes = MIME_TYPES;

    @Input() entityUpload: EntitySpreadsheetUpload<any>;
    // Calculated
    sheetHeadings: string[] = [];
    spreadsheetFile: File;
    spreadsheet: WorkBook;
    spreadsheetData: any[][];

    // Sheets
    selectedSheetName: string;

    // Files
    files: File[] = [];

    @ViewChild('generalFileUpload') generalFileUpload: GeneralFileUploadComponent;
    @ViewChild('excelColumnMapper') excelColumnMapper: ExcelColumnMapperComponent;

    @Output() onFilesSelected = new EventEmitter<File[]>();
    @Output() onUploadChange = new EventEmitter<FileUploadData>();
    @Output() filesOnQueue = new EventEmitter<boolean>();
    constructor() {}

    ngOnInit() {}

    checkIfFileUploadedOnQueue(selectedFile: boolean) {
        this.filesOnQueue.emit(selectedFile);
    }
    onFilesChanged(files: FileItem[]) {
        if (files.length === 1) {
            this.files = files.map((file) => file._file);
            this.onFilesSelected.emit(this.files);
            this.spreadsheetFile = this.files[0];
            this.setWorkbookFromFile(this.spreadsheetFile);
        } else {
            this.spreadsheetFile = undefined;
        }

        this.emitUploadDataChange();
    }

    private setWorkbookFromFile(file: File) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const arrayBuffer = fileReader.result as ArrayBuffer;
            const data = new Uint8Array(arrayBuffer);
            const arr = [];
            for (let i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            const binary = arr.join('');
            this.spreadsheet = XLSX.read(binary, { type: 'binary', cellText: false, cellDates: true });
            this.selectedSheetName = this.spreadsheet.SheetNames[0];
            this.calculateSpreadsheetColumns();
        };
        fileReader.readAsArrayBuffer(file);
    }

    calculateSpreadsheetColumns() {
        this.spreadsheetData = XLSX.utils.sheet_to_json(this.spreadsheet.Sheets[this.selectedSheetName], {
            header: 1,
            blankrows: false,
        });
        this.sheetHeadings = this.spreadsheetData[0];
        this.emitUploadDataChange();
    }

    public getHeadingMap(): { [key: string]: string } {
        return this.excelColumnMapper.mappedHeadings;
    }

    public getData() {
        return this.spreadsheetData;
    }

    public getFile() {
        return this.spreadsheetFile;
    }

    isCompleted() {
        return this.spreadsheetFile && this.excelColumnMapper.mappedHeadings;
    }

    onChangeSheet() {
        this.calculateSpreadsheetColumns();
    }

    private emitUploadDataChange() {
        this.onUploadChange.emit(this.getUploadData());
    }

    private getUploadData(): FileUploadData {
        return {
            sheetHeadings: this.sheetHeadings,
            spreadsheetFile: this.spreadsheetFile,
            spreadsheet: this.spreadsheet,
            spreadsheetData: this.spreadsheetData,
            selectedSheetName: this.selectedSheetName,
            files: this.files,
        };
    }
}
