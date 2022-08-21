import { Component, OnDestroy, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { IssuerService } from '@modules/issuer/services/issuer.service';

@Component({
    selector: 'rp-account-reporting-page',
    templateUrl: './account-reporting-page.component.html',
    styleUrls: ['./account-reporting-page.component.less'],
})
export class AccountReportingPageComponent implements OnInit, OnDestroy {
    constructor(private issuerService: IssuerService) {}

    ngOnInit() {
        this.issuerService.getPoliceIssuer().pipe(take(1)).subscribe();
    }

    ngOnDestroy(): void {}
}
