import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-contract-page',
    templateUrl: './view-contract-page.component.html',
    styleUrls: ['./view-contract-page.component.less'],
})
export class ViewContractPageComponent implements OnInit {
    contractId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getContractIdFromParam();
    }

    ngOnInit() {}

    getContractIdFromParam() {
        this.route.params.subscribe((params) => {
            this.contractId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'contracts']);
    }
}
