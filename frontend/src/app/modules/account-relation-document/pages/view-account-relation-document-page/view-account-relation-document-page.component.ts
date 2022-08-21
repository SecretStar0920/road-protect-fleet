import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-account-relation-document-page',
    templateUrl: './view-account-relation-document-page.component.html',
    styleUrls: ['./view-account-relation-document-page.component.less'],
})
export class ViewAccountRelationDocumentPageComponent implements OnInit {
    accountRelationDocumentId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getAccountRelationDocumentIdFromParam();
    }

    ngOnInit() {}

    getAccountRelationDocumentIdFromParam() {
        this.route.params.subscribe((params) => {
            this.accountRelationDocumentId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'account-relation-documents']);
    }
}
