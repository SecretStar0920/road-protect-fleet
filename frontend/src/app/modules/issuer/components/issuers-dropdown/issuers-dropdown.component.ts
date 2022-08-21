import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { select, Store } from '@ngrx/store';
import { issuerNgrxHelper, IssuerState } from '@modules/issuer/ngrx/issuer.reducer';
import { IssuerService } from '@modules/issuer/services/issuer.service';
import { mergeMap } from 'rxjs/operators';
import { isEmpty, cloneDeep } from 'lodash';
import { of } from 'rxjs';

@Component({
    selector: 'rp-issuers-dropdown',
    templateUrl: './issuers-dropdown.component.html',
    styleUrls: ['./issuers-dropdown.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IssuersDropdownComponent),
            multi: true,
        },
    ],
})
export class IssuersDropdownComponent implements OnInit, ControlValueAccessor {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input()
    issuers: Issuer[] = [];

    private _selectedIssuers: string[];
    get selectedIssuers(): string[] {
        return this._selectedIssuers;
    }

    @Input()
    set selectedIssuers(issuers: string[]) {
        this._selectedIssuers = issuers;
        const selectedIssuers = this.issuers.filter((issuer) => issuers.indexOf(issuer.code) > -1);
        this.selectedIssuerEntities.emit(cloneDeep(selectedIssuers));

        if (this.onChange) {
            this.onChange(issuers);
            this.onTouched();
        }
    }

    @Output() selectedIssuerEntities = new EventEmitter<Issuer[]>();

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

    writeValue(value: string[]): void {
        if (value) {
            this.selectedIssuers = value;
        }
    }
}
