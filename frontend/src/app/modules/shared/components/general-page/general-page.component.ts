import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ThemeType } from '@ant-design/icons-angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-general-page',
    templateUrl: './general-page.component.html',
    styleUrls: ['./general-page.component.less'],
})
export class GeneralPageComponent implements OnInit {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() icon: string;
    @Input() iconTheme: ThemeType = 'twotone';
    @Input() enableBreadcrumb: boolean = true;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private cdf: ChangeDetectorRef) {}

    ngOnInit(): void {}
}
