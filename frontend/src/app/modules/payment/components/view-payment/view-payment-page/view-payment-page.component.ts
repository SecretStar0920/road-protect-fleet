import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-payment-page',
    templateUrl: './view-payment-page.component.html',
    styleUrls: ['./view-payment-page.component.less'],
})
export class ViewPaymentPageComponent implements OnInit {
    paymentId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getPaymentIdFromParam();
    }

    ngOnInit() {}

    getPaymentIdFromParam() {
        this.route.params.subscribe((params) => {
            this.paymentId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'payments']);
    }
}
