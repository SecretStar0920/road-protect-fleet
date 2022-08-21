import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { isNil } from 'lodash';
import i18next from 'i18next';

@Component({
    selector: 'rp-general-time-display',
    templateUrl: './general-time-display.component.html',
    styleUrls: ['./general-time-display.component.less'],
})
export class GeneralTimeDisplayComponent implements OnInit {
    get time(): Moment | string {
        if (typeof this._time === 'string') {
            this._time = moment(this._time);
        }
        return this._time;
    }

    @Input()
    set time(value: Moment | string) {
        // @ts-ignore
        if (isNil(value)) {
            this.isInfinite = true;
        }
        this._time = moment(value);
    }

    @Input() short: boolean = false;

    isInfinite: boolean = false;

    formats =
        i18next.dir(i18next.language) === 'ltr'
            ? {
                  long: 'MMMM Do YYYY, h:mm a',
                  short: 'MMMM Do YYYY',
              }
            : {
                  long: 'DD/MM/YYYY, HH:mm',
                  short: 'DD/MM/YYYY',
              };

    private _time: Moment;

    constructor() {}

    ngOnInit() {}
}
