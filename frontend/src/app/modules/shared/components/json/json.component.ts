import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'rp-json',
    templateUrl: './json.component.html',
    styleUrls: ['./json.component.less'],
})
export class JsonComponent implements OnInit {
    @Input() data: any;
    @Input() maxHeight: string;

    constructor() {}

    ngOnInit() {}

    isString(data: any) {
        return typeof data === 'string';
    }

    isObject(data: any) {
        return typeof data === 'object';
    }
}
