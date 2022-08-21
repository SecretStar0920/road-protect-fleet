import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { isNil } from 'lodash';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import i18next from 'i18next';
import { GraphingParameters, graphingSelectedParameters } from '@modules/graphing/ngrx/graphing.actions';
import { mapTranslatedToInfringementStatus } from '@modules/graphing/services/map-translated-to-infringement-status.const';
import { Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import moment from 'moment';
import { GeneralMappedGraphingByData } from '@modules/graphing/services/graphing-table.service';

@Component({
    selector: 'rp-graphing-by-table-cell-template',
    templateUrl: './graphing-by-table-cell-template.component.html',
    styleUrls: ['./graphing-by-table-cell-template.component.less'],
})
export class GraphingByTableCellTemplateComponent implements OnInit {
    @Input() cellText: string;
    @Input() extraText: string;
    @Input() extraTemplate: TemplateRef<any>;
    @Input() extraData: any;
    @Input() detailsObject: GeneralMappedGraphingByData;
    @Input() isPreviousYear: boolean;
    total: string;
    detailsArray: { status: string; value: string }[] = [];
    infringementStatuses = InfringementStatus;

    constructor(private store: Store<GraphingState>) {}

    ngOnInit(): void {
        const numberFormatOptions = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        if (isNil(this.detailsObject)) {
            this.total = '₪ ' + Number(0).toLocaleString('he-IL', numberFormatOptions) + ' (0)';
        } else {
            this.total =
                '₪ ' +
                Number(this.detailsObject?.sum).toLocaleString('he-IL', numberFormatOptions) +
                ' ' +
                `(${this.detailsObject?.count})`;
            Object.values(this.infringementStatuses).forEach((status) => {
                if (isNil(this.detailsObject.status[status])) {
                    this.detailsArray.push({
                        status: i18next.t('infringement-status.' + status),
                        value: '₪ ' + Number(0).toLocaleString('he-IL', numberFormatOptions) + ' (0)',
                    });
                } else {
                    this.detailsArray.push({
                        status: i18next.t('infringement-status.' + status),
                        value:
                            '₪ ' +
                            Number(this.detailsObject.status[status]?.sum).toLocaleString('he-IL', numberFormatOptions) +
                            ' ' +
                            `(${this.detailsObject.status[status]?.count})`,
                    });
                }
            });
        }
    }

    viewInfringements(status?: any) {
        const queryParameters: GraphingParameters = {
            mine: true,
            endDate: null,
            graphing: true,
            issuers: [],
            infringementStatus: null,
            startDate: null,
            vehicleRegistration: null,
        };
        //    If the view is by status, set the status for all cells
        if (this.detailsObject.statusName) {
            status = this.detailsObject.statusName;
        }

        //    If the status is specified then map translated to the enum value
        if (!isNil(status)) {
            queryParameters.infringementStatus = mapTranslatedToInfringementStatus[status];
        }

        //    Added specified issuers if there are some
        if (this.detailsObject.name) {
            queryParameters.issuers = [this.detailsObject.name];
        }

        //    Add specified registration if there is one
        if (this.detailsObject.registration) {
            queryParameters.vehicleRegistration = this.detailsObject.registration;
        }

        //    Calculate the start and end date from the offence date in the details object
        if (!isNil(this.detailsObject.offenceDate)) {
            queryParameters.startDate = this.detailsObject.offenceDate;
            queryParameters.endDate = moment(this.detailsObject.offenceDate).add(1, 'month').toISOString();
        }

        //    Dispatch the selection action and view the infringements
        this.store.dispatch(graphingSelectedParameters({ data: queryParameters, triggerView: true }));
    }
}
