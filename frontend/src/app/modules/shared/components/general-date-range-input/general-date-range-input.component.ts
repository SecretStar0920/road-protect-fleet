import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { isNil } from 'lodash';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AccountState } from '@modules/account/ngrx/account.reducer';
import { AccountService } from '@modules/account/services/account.service';

export interface IDateRange {
    min: Date;
    max: Date;
}

@Component({
    selector: 'rp-general-date-range-input',
    templateUrl: './general-date-range-input.component.html',
    styleUrls: ['./general-date-range-input.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GeneralDateRangeInputComponent),
            multi: true,
        },
    ],
})
export class GeneralDateRangeInputComponent implements OnInit, ControlValueAccessor, OnDestroy {
    private destroy$ = new Subject();
    @Input() displayModifiers: boolean = true;
    @Input() displayLastYearModifier: boolean = true;
    @Input() displayLastMonthModifier: boolean = true;
    @Input() displayLastWeekModifier: boolean = true;
    @Input() displayCurrentYearModifier: boolean = false;
    @Input() displayCurrentMonthModifier: boolean = false;
    @Input() displayPreviousYearModifier: boolean = false;
    @Input() displayAllModifier: boolean = false;
    @Input() isCompact: boolean = false;
    @Output() newDate: EventEmitter<IDateRange> = new EventEmitter();

    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;
    isDisabled: boolean = false;

    private _value: IDateRange = {
        min: null,
        max: null,
    };

    private _datePickerValue = {
        min: null,
        max: null,
    };

    currentYear = moment().year();
    previousYear = this.currentYear - 1;

    get datePickerValue() {
        return this._datePickerValue;
    }

    set datePickerValue(value: any) {
        this._datePickerValue = value;
    }

    get value(): IDateRange {
        return this._value;
    }

    set value(value: IDateRange) {
        if (isNil(value)) {
            value = {
                min: null,
                max: null,
            };
        }
        this._value = value;
        if (this.onChange) {
            this.onChange(value);
        }

        if (this.onTouched) {
            this.onTouched();
        }
    }

    constructor(private store: Store<AccountState>, private accountService: AccountService) {}

    ngOnInit() {}

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    writeValue(value: IDateRange): void {
        this.value = value;
        this.newDate.emit(this.value);
    }

    writeCompactValue(value: IDateRange): void {
        if (!isNil(value)) {
            const temp = {
                min: null,
                max: null,
            };
            if (!isNil(value.max)) {
                temp.max = moment(value.max.setHours(23, 59, 59)).toDate();
            }
            if (!isNil(value.min)) {
                temp.min = moment(value.min.setHours(0, 0, 0)).toDate();
            }
            value = temp;
        }
        this.writeValue(value);
    }

    modify(amount, unit) {
        this.value = {
            min: moment().subtract(amount, unit).toDate(),
            max: moment().toDate(),
        };
        this.newDate.emit(this.value);
    }

    setPeriodToAll() {
        this.value = {
            min: null,
            max: moment().utc().endOf('month').toDate(),
        };
        this.newDate.emit(this.value);
    }

    modifyPeriod(amount, unit) {
        this.value = {
            min: moment().utc().startOf(unit).subtract(amount, unit).toDate(),
            max: moment().utc().endOf(unit).subtract(amount, unit).toDate(),
        };
        this.newDate.emit(this.value);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
