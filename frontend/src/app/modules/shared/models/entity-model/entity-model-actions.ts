import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export class EntityModelActions<Model = any> {
    constructor(public entity: string) {}

    load = createAction(`[${this.entity}] Load`, props<{ items: Model[] }>());

    addOne = createAction(`[${this.entity}] Add One`, props<{ item: Model }>());

    upsertOne = createAction(`[${this.entity}] Upsert One`, props<{ item: Model }>());

    upsertMany = createAction(`[${this.entity}] Upsert Many`, props<{ items: Model[] }>());

    addMany = createAction(`[${this.entity}] Add Many`, props<{ items: Model[] }>());

    updateOne = createAction(`[${this.entity}] Update One`, props<{ item: Update<Model> }>());

    updateMany = createAction(`[${this.entity}] Update Many`, props<{ items: Update<Model>[] }>());

    deleteOne = createAction(`[${this.entity}] Delete One`, props<{ id: string }>());

    deleteMany = createAction(`[${this.entity}] Delete Many`, props<{ ids: string[] }>());

    clear = createAction(`[${this.entity}] Clear`);
}
