import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environment/environment.prod';
import { asCurrency } from '@modules/shared/constants/dto-transforms';
import { isNaN, isNil } from 'lodash';

@Component({
    selector: 'rp-general-currency-display',
    templateUrl: './general-currency-display.component.html',
    styleUrls: ['./general-currency-display.component.less'],
})
export class GeneralCurrencyDisplayComponent implements OnInit {
    @Input() code: string = environment.currency.code;
    private _value: string | number;
    get value(): string | number {
        if (isNaN(this._value)) {
            return null;
        }
        return this._value;
    }

    @Input()
    set value(value: string | number) {
        if (isNil(value) || isNaN(value) || value === 'NaN') {
            return;
        }
        this._value = asCurrency(value);
    }

    constructor() {}

    ngOnInit() {}
}
