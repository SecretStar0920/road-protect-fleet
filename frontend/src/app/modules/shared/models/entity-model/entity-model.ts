import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { EntityModelActions } from '@modules/shared/models/entity-model/entity-model-actions';
import { createEntityAdapter, EntityAdapter, Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { EntityModelSelectors } from '@modules/shared/models/entity-model/entity-model-selectors';

@Injectable({
    providedIn: 'root',
})
/**
 * For use with @ngrx/entity to reduce boilerplate
 */
export abstract class EntityModel<Model> {
    protected entity: string;
    protected actionTag: string;
    protected primaryKey: string;
    protected actions: EntityModelActions<Model>;
    // protected actions: EntityModelActions<Model> = new EntityModelActions<Model>(this.actionTag);
    protected selectors: EntityModelSelectors<Model>;
    // protected selectors: EntityModelSelectors<Model> = new EntityModelSelectors<Model>(this.entity);
    protected entityAdapter: EntityAdapter<Model> = createEntityAdapter<Model>({ selectId: (entity) => entity[this.primaryKey] });

    static relation() {
        return {};
    }

    constructor(protected store: Store<AppState>) {}

    getOne(id: string | number): Observable<Model> {
        return this.store.pipe(select(this.selectors.selectOne(id)));
    }

    getMany(): Observable<Model[]> {
        return this.store.pipe(select(this.selectors.selectAll()));
    }

    getManyMapped(): Observable<{ [key: string]: Model }> {
        return this.store.pipe(select(this.selectors.selectMapped()));
    }

    getManyWhere(property: string, value: any): Observable<Model[]> {
        return this.store.pipe(select(this.selectors.selectAllWhere(property, value)));
    }

    load(items: Model[]) {
        this.store.dispatch(this.actions.load({ items }));
    }

    addOne(item: Model) {
        this.store.dispatch(this.actions.addOne({ item }));
    }

    upsertOne(item: Model) {
        this.store.dispatch(this.actions.upsertOne({ item }));
    }

    upsertMany(items: Model[]) {
        this.store.dispatch(this.actions.upsertMany({ items }));
    }

    addMany(items: Model[]) {
        this.store.dispatch(this.actions.addMany({ items }));
    }

    updateOne(item: Update<Model>) {
        this.store.dispatch(this.actions.updateOne({ item }));
    }

    updateMany(items: Update<Model>[]) {
        this.store.dispatch(this.actions.updateMany({ items }));
    }

    deleteOne(id: string) {
        this.store.dispatch(this.actions.deleteOne({ id }));
    }

    deleteMany(ids: string[]) {
        this.store.dispatch(this.actions.deleteMany({ ids }));
    }

    clear() {
        this.store.dispatch(this.actions.clear());
    }
}
