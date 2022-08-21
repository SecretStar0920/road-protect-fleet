import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

@Component({
    selector: 'rp-generate-account-relations',
    templateUrl: './generate-account-relations.component.html',
    styleUrls: ['./generate-account-relations.component.less'],
})
export class GenerateAccountRelationsComponent implements OnInit {
    generateState = new ElementStateModel();

    constructor(private store: Store<AppState>, private accountRelationService: AccountRelationApiService) {}

    ngOnInit() {}

    onGenerate() {
        this.generateState.submit();
        this.accountRelationService.generateAccountRelationFromContracts().subscribe(
            (result) => {
                this.generateState.onSuccess(`Successfully generated ${result.length} relation(s)`);
            },
            (error) => {
                this.generateState.onFailure('Failed to generate relations', error);
            },
        );
    }
}
