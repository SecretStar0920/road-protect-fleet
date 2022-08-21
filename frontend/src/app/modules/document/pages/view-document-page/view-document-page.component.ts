import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-document-page',
    templateUrl: './view-document-page.component.html',
    styleUrls: ['./view-document-page.component.less'],
})
export class ViewDocumentPageComponent implements OnInit {
    documentId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getDocumentIdFromParam();
    }

    ngOnInit() {}

    getDocumentIdFromParam() {
        this.route.params.subscribe((params) => {
            this.documentId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'documents']);
    }
}
