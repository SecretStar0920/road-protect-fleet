import { createSelector } from '@ngrx/store';
import { filter, get, isEqual } from 'lodash';

export class EntityModelSelectors<Model> {
    constructor(private entity: string) {}

    private featureSelector = (state) => state[this.entity];

    selectOne(id: string | number) {
        return createSelector(this.featureSelector, (state) => state.entities[id]);
    }

    selectAll() {
        return createSelector(this.featureSelector, (state) => Object.values(state.entities) as Model[]);
    }

    selectMapped() {
        return createSelector(this.featureSelector, (state) => state.entities);
    }

    selectAllWhere(property: string, value: any) {
        return createSelector(this.selectAll(), (entities) => {
            return filter(entities, (entity) => {
                return isEqual(get(entity, property, false), value);
            });
        });
    }
}
