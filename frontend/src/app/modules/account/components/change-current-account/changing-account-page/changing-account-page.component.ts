import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'rp-changing-account-page',
    templateUrl: './changing-account-page.component.html',
    styleUrls: ['./changing-account-page.component.less'],
})
export class ChangingAccountPageComponent implements OnInit {
    constructor(private location: Location) {}

    ngOnInit() {
        setTimeout(() => {
            this.location.back();
        }, 600);
    }
}
