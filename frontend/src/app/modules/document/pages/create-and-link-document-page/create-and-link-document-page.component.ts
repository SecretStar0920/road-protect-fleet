import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentLinkableTargets } from '@modules/document/services/document.service';
import { isNil } from 'lodash';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'rp-create-and-link-document-page',
    templateUrl: './create-and-link-document-page.component.html',
    styleUrls: ['./create-and-link-document-page.component.less'],
})
export class CreateAndLinkDocumentPageComponent implements OnInit {
    @Input() target: DocumentLinkableTargets;
    @Input() targetId: string;
    @Input() description: string;

    constructor(private route: ActivatedRoute, private logger: NGXLogger) {
        this.route.params.subscribe((result) => {
            this.target = result.target;
            this.targetId = result.targetId;
            if (isNil(this.target) || isNil(this.targetId)) {
                this.logger.error('Invalid params or not initialised');
            }
        });

        this.route.queryParams.subscribe((result) => {
            this.description = result.description;
        });
    }

    ngOnInit() {}
}
