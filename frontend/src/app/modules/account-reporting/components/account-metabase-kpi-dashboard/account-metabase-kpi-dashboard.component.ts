import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IMetabaseItemDetails } from '@modules/shared/dtos/reporting-data.dto';

@Component({
    selector: 'rp-account-metabase-kpi-dashboard',
    templateUrl: './account-metabase-kpi-dashboard.component.html',
    styleUrls: ['./account-metabase-kpi-dashboard.component.less'],
})
export class AccountMetabaseKpiDashboardComponent implements OnInit {
    @Input() reportDetails: IMetabaseItemDetails;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {}

    // https://filipmolcik.com/error-unsafe-value-used-in-a-resource-url-context/
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
