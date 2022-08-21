import { EntityModel } from '@modules/shared/models/entity-model/entity-model';
import { EntityModelActions } from '@modules/shared/models/entity-model/entity-model-actions';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { Injectable } from '@angular/core';
import { EntityModelSelectors } from '@modules/shared/models/entity-model/entity-model-selectors';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

@Injectable({
    providedIn: 'root',
})
export class NominationEntityModel extends EntityModel<Nomination> {
    protected entity = 'nomination';
    protected actionTag = 'Nomination';
    protected primaryKey = 'nominationId';
    protected actions = new EntityModelActions<Nomination>(this.actionTag);
    protected selectors: EntityModelSelectors<Nomination> = new EntityModelSelectors<Nomination>(this.entity);
    protected entityAdapter: EntityAdapter<Nomination> = createEntityAdapter<Nomination>({ selectId: (entity) => entity[this.primaryKey] });
}
