import { Component, Input, OnInit } from '@angular/core';
import { Infringement, InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { Dictionary, groupBy } from 'lodash';

@Component({
    selector: 'rp-infringement-count-by-status',
    templateUrl: './infringement-count-by-status.component.html',
    styleUrls: ['./infringement-count-by-status.component.less'],
})
export class InfringementCountByStatusComponent implements OnInit {
    infringementStatuses = InfringementStatus;

    private _infringements: Infringement[];
    get infringements(): Infringement[] {
        return this._infringements;
    }

    @Input()
    set infringements(value: Infringement[]) {
        this._infringements = value;
        this.generateGrouped();
    }

    grouped: Dictionary<Infringement[]>;

    constructor() {}

    ngOnInit() {}

    generateGrouped() {
        this.grouped = groupBy(this._infringements, 'status');
    }
}
