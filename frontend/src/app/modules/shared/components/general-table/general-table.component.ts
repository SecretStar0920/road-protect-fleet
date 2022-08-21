import { Component, Input, OnInit } from '@angular/core';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { UserType } from '@modules/shared/models/entities/user.model';

@Component({
    selector: 'rp-general-table',
    templateUrl: './general-table.component.html',
    styleUrls: ['./general-table.component.less'],
})
export class GeneralTableComponent implements OnInit {
    @Input() table: GeneralTableService;

    scroll: { x: string; y?: string } = {
        x: '100%',
    };

    userTypes = UserType;

    constructor() {}

    ngOnInit() {}
}
