import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpreadsheetService } from '@modules/shared/modules/spreadsheet/services/spreadsheet.service';

@Component({
    selector: 'rp-general-table-export',
    templateUrl: './general-table-export.component.html',
    styleUrls: ['./general-table-export.component.less'],
})
export class GeneralTableExportComponent implements OnInit {
    @Input() entity: string;
    exportForm: FormGroup;

    constructor(private fb: FormBuilder, private spreadsheet: SpreadsheetService) {}

    ngOnInit() {
        this.exportForm = this.fb.group({
            dataSelection: new FormControl(0, Validators.required),
        });
    }

    onExport() {
        this.spreadsheet.exportEntityAsSpreadsheet(this.entity).subscribe();
    }
}
