import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneratedDocumentService } from '@modules/generated-document/services/generated-document.service';
import { GeneratedDocument } from '@modules/shared/models/entities/generated-document.model';
import { DocumentLinkableTargets } from '@modules/document/services/document.service';

@Component({
    selector: 'rp-edit-generated-document-page',
    templateUrl: './edit-generated-document-page.component.html',
    styleUrls: ['./edit-generated-document-page.component.less'],
})
export class EditGeneratedDocumentPageComponent implements OnInit {
    generatedDocumentId: number;
    generatedDocument: GeneratedDocument;

    target: DocumentLinkableTargets;
    targetId: string;

    constructor(private route: ActivatedRoute, private generatedDocumentService: GeneratedDocumentService) {
        this.getGeneratedDocumentIdFromParam();
    }

    ngOnInit() {}

    getGeneratedDocumentIdFromParam() {
        this.route.params.subscribe((params) => {
            this.generatedDocumentId = Number(params.id);
            this.target = params.target;
            this.targetId = params.targetId;
            this.getGeneratedDocument();
        });
    }

    getGeneratedDocument() {
        this.generatedDocumentService.getGeneratedDocument(this.generatedDocumentId).subscribe((result) => {
            this.generatedDocument = result;
        });
    }
}
