import { Component, Input, OnInit } from '@angular/core';
import { NgxDataPoint } from '@modules/shared/models/ngx-series-data.model';

export enum CardFormat {
    currency = 'currency',
    none = 'none',
}

@Component({
    selector: 'rp-home-number-card',
    templateUrl: './home-number-card.component.html',
    styleUrls: ['./home-number-card.component.less'],
})
export class HomeNumberCardComponent implements OnInit {
    @Input() data: NgxDataPoint[];
    @Input() format: CardFormat = CardFormat.none;
    cardFormat = CardFormat;

    constructor() {}

    ngOnInit() {}
}
