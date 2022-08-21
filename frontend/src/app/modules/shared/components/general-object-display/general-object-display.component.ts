import { Component, Input, OnInit } from '@angular/core';
import { isObjectLike } from 'lodash';

@Component({
    selector: 'rp-general-object-display',
    templateUrl: './general-object-display.component.html',
    styleUrls: ['./general-object-display.component.less'],
})
export class GeneralObjectDisplayComponent implements OnInit {
    @Input() title: string;
    @Input() data: any;

    constructor() {}

    ngOnInit() {}

    isObject(value: any): boolean {
        return isObjectLike(value);
    }
}
