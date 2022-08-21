import { Component, Input, OnInit } from '@angular/core';
import { Issuer } from '@modules/shared/models/entities/issuer.model';

@Component({
    selector: 'rp-issuer-tag',
    templateUrl: './issuer-tag.component.html',
    styleUrls: ['./issuer-tag.component.less'],
})
export class IssuerTagComponent implements OnInit {
    @Input() issuer: Issuer;

    constructor() {}

    ngOnInit() {}
}
