import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export enum SortOrder {
    Asc = 'ASC',
    Desc = 'DESC',
    None = 'NONE',
}

@Component({
    selector: 'rp-general-sort',
    templateUrl: './general-sort.component.html',
    styleUrls: ['./general-sort.component.less'],
})
export class GeneralSortComponent implements OnInit {
    currentSortOrderIndex = 0;
    sortOrderOrder = [SortOrder.None, SortOrder.Asc, SortOrder.Desc];
    orders = SortOrder;

    get order(): SortOrder {
        return this._order;
    }

    @Input()
    set order(value: SortOrder) {
        this._order = value;
        this.orderChange.emit(this.order);
    }
    private _order: SortOrder = this.sortOrderOrder[this.currentSortOrderIndex];

    @Output() orderChange: EventEmitter<SortOrder> = new EventEmitter<SortOrder>();

    constructor() {}

    ngOnInit(): void {}

    onSortChange() {
        this.currentSortOrderIndex = (this.currentSortOrderIndex + 1) % this.sortOrderOrder.length;
        this.order = this.sortOrderOrder[this.currentSortOrderIndex];
    }
}
