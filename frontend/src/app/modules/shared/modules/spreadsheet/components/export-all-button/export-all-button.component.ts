import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '@modules/shared/modules/spreadsheet/services/spreadsheet.service';

@Component({
    selector: 'rp-export-all-button',
    templateUrl: './export-all-button.component.html',
    styleUrls: ['./export-all-button.component.less'],
})
export class ExportAllButtonComponent implements OnInit {
    constructor(private spreadsheetService: SpreadsheetService) {}

    ngOnInit() {}

    onExportAll() {
        this.spreadsheetService.exportAllAsSpreadsheet().subscribe();
    }
}
