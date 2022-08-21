import { Component, Input, OnInit } from '@angular/core';
import { SingleSeries } from '@swimlane/ngx-charts';
import { ExportJsonToSheetService } from '@modules/shared/services/spreadsheet-service/export-json-to-sheet.service';

@Component({
    selector: 'rp-general-chart-container',
    templateUrl: './general-chart-container.component.html',
    styleUrls: ['./general-chart-container.component.less'],
})
export class GeneralChartContainerComponent implements OnInit {
    @Input() title: string;
    @Input() data: SingleSeries;

    constructor(private jsonToSheetService: ExportJsonToSheetService) {}

    ngOnInit() {}

    exportDataAsSpreadsheet() {
        this.jsonToSheetService.writeDataToFile(
            this.data.map((d) => {
                return { name: d.name, value: d.value };
            }),
            this.title,
            this.title,
        );
    }
}
