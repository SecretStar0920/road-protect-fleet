import { Component, Input, OnInit } from '@angular/core';
import { Infringement } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-infringement-tag',
    templateUrl: './infringement-tag.component.html',
    styleUrls: ['./infringement-tag.component.less'],
})
export class InfringementTagComponent implements OnInit {
    @Input() infringement: Infringement;

    constructor() {}

    ngOnInit() {}
}
