import { Component, Input, OnInit } from '@angular/core';
import { InfringementService } from '@modules/infringement/services/infringement.service';

@Component({
    selector: 'rp-check-redirection-details',
    templateUrl: './check-redirection-details.component.html',
    styleUrls: ['./check-redirection-details.component.less'],
})
export class CheckRedirectionDetailsComponent implements OnInit {
    @Input() infringementId: number;

    isVisible: boolean = false;

    constructor(private infringementService: InfringementService) {}

    ngOnInit() {}

    onCheck() {
        this.isVisible = true;
    }
}
