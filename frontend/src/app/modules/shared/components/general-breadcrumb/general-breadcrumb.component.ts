import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNil } from 'lodash';
import i18next from 'i18next';

@Component({
    selector: 'rp-general-breadcrumb',
    templateUrl: './general-breadcrumb.component.html',
    styleUrls: ['./general-breadcrumb.component.less'],
})
export class GeneralBreadcrumbComponent implements OnInit {
    routes: { label: string; url: string }[] = [];

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private cdf: ChangeDetectorRef) {}

    ngOnInit() {
        this.getRouteData();
    }

    getRouteData() {
        this.checkData(this.activatedRoute.root);
        this.cdf.markForCheck();
    }

    checkData(route: ActivatedRoute, url: string = '') {
        const snapshot = route.snapshot;
        if (snapshot.url.length > 0) {
            let label = snapshot.data['breadcrumb'];
            url = `${url}/${snapshot.url.map((segment) => segment.path).join('/')}`;
            if (isNil(label)) {
                if (url === '/home') {
                    label = i18next.t('breadcrumb.home');
                }
            }
            this.routes.push({ label, url });
        }
        for (const child of route.children) {
            this.checkData(child, url);
        }
    }
}
