import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { IMetabaseItemDetails } from '@modules/shared/dtos/reporting-data.dto';
import { MetabaseReportViewComponent } from '@modules/account-reporting/components/metabase-report-view/metabase-report-view.component';
import { DomSanitizer } from '@angular/platform-browser';

const iconMapping = {
    bar: 'bar-chart',
    table: 'profile',
    line: 'line-chart',
    combo: 'area-chart',
    area: 'area-chart',
    row: 'bars',
    scatter: 'dot-chart',
    pie: 'pie-chart',
    funnel: 'funnel-plot',
    smartscalar: 'percentage',
    progress: 'percentage',
    gauge: 'dashboard',
    scalar: 'number',
    map: 'environment',
};

@Component({
    selector: 'rp-metabase-report-details',
    templateUrl: './metabase-report-details.component.html',
    styleUrls: ['./metabase-report-details.component.less'],
})
export class MetabaseReportDetailsComponent implements OnInit {
    @Input() reportDetails: IMetabaseItemDetails;
    viewReportModal: NzModalRef<any>;
    icon: string;

    constructor(private modalService: NzModalService, private sanitizer: DomSanitizer) {}

    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    ngOnInit() {
        this.icon = this.selectIcon(this.reportDetails.display);
    }

    selectIcon(metabaseDisplay: string) {
        let selectedIcon = iconMapping[metabaseDisplay];

        if (!selectedIcon) {
            selectedIcon = 'profile';
        }

        return selectedIcon;
    }

    onViewReport() {
        this.viewReportModal = this.modalService.create({
            nzContent: MetabaseReportViewComponent,
            nzFooter: null,
            nzWidth: '70%',
            nzComponentParams: { reportDetails: this.reportDetails },
        });
    }
}
