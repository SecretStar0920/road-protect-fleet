import { Component, Input, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

@Component({
    selector: 'rp-general-state-model-alert',
    templateUrl: './general-state-model-alert.component.html',
    styleUrls: ['./general-state-model-alert.component.less'],
})
export class GeneralStateModelAlertComponent implements OnInit {
    @Input() state: ElementStateModel = new ElementStateModel<any>();
    @Input() showSuccess: boolean = true;

    constructor() {}

    ngOnInit() {}
}
