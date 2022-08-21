import { Component, Input, OnInit } from '@angular/core';
import { InfringementStatus, InfringementTag } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-infringement-tags',
    templateUrl: './infringement-tags.component.html',
    styleUrls: ['./infringement-tags.component.less'],
})
export class InfringementTagsComponent implements OnInit {
    @Input() tags: InfringementTag[];

    infringementStatus = InfringementStatus;

    constructor() {
    }

    ngOnInit() {}
}
