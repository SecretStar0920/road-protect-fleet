import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { issuerNgrxHelper, IssuerState } from '@modules/issuer/ngrx/issuer.reducer';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { mergeMap } from 'rxjs/operators';
import { IssuerService } from '@modules/issuer/services/issuer.service';
import { of } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEmpty } from 'lodash';

@Component({
    selector: 'rp-issuer-dropdown',
    templateUrl: './issuer-dropdown.component.html',
    styleUrls: ['./issuer-dropdown.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IssuerDropdownComponent),
            multi: true,
        },
    ],
})
export class IssuerDropdownComponent implements OnInit, ControlValueAccessor {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input() disable: boolean = false;

    @Input()
    issuers: Issuer[] = [];
    private _selectedIssuer: number;
    get selectedIssuer(): number {
        return this._selectedIssuer;
    }

    @Input()
    set selectedIssuer(value: number) {
        this._selectedIssuer = value;
        if (value) {
            this.selectedIssuerEntity.emit(this.issuers.find((issuer) => issuer.code.toString() === value.toString()));
        } else {
            this.selectedIssuerEntity.emit(null);
        }

        if (this.onChange) {
            this.onChange(value);
            this.onTouched();
        }
    }

    @Output() selectedIssuerEntity = new EventEmitter<Issuer>();

    constructor(private store: Store<IssuerState>, private issuerService: IssuerService) {}

    ngOnInit() {
        this.getIssuers();
    }

    getIssuers() {
        this.store
            .pipe(
                select(issuerNgrxHelper.entitySelectors.selectAll),
                mergeMap((issuers) => {
                    if (isEmpty(issuers)) {
                        return this.issuerService.getAllIssuers();
                    }
                    return of(issuers);
                }),
            )
            .subscribe((issuers) => {
                this.issuers = issuers;
            });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {}

    writeValue(value: number): void {
        if (value) {
            this.selectedIssuer = value;
        }
    }
}
