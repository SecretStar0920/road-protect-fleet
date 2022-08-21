import { Component, Input, OnInit } from '@angular/core';
import { LeaseContract } from '@modules/shared/models/entities/contract.model';
import * as moment from 'moment';
import { endWith } from 'rxjs/operators';

@Component({
    selector: 'rp-view-ocr-result',
    templateUrl: './view-ocr-result.component.html',
    styleUrls: ['./view-ocr-result.component.less'],
})
export class ViewOcrResultComponent implements OnInit {
    @Input() contract: LeaseContract;

    ocrResults: {
        customer: boolean;
        owner: boolean;
        car: boolean;
        start: boolean;
        end: boolean;
    };

    constructor() {}

    ngOnInit() {
        this.ocrResults = {
            customer: this.contract.document.ocr.customer === this.contract.user?.identifier,
            owner: this.contract.document.ocr.owner === this.contract.owner?.identifier,
            car: this.contract.document.ocr.car === this.contract.vehicle?.registration,
            end: this.isSameDate(this.contract.document.ocr.end, this.contract.endDate),
            start: this.isSameDate(this.contract.document.ocr.start, this.contract.startDate),
        };
    }

    isSameDate(contractDate: string, ocrDate: string) {
        return moment(contractDate).endOf('day').isSame(moment(ocrDate).endOf('day'));
    }
}
