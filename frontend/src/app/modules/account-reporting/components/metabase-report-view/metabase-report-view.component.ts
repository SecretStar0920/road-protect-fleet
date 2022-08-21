import { Component, Input, OnInit } from '@angular/core';
import { IMetabaseItemDetails } from '@modules/shared/dtos/reporting-data.dto';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'rp-metabase-report-view',
    templateUrl: './metabase-report-view.component.html',
    styleUrls: ['./metabase-report-view.component.less'],
})
export class MetabaseReportViewComponent implements OnInit {
    @Input() reportDetails: IMetabaseItemDetails;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {}

    // https://filipmolcik.com/error-unsafe-value-used-in-a-resource-url-context/
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
