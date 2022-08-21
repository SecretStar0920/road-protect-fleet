import { createAction, createSelector, on, props } from '@ngrx/store';
import { EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { difference } from 'lodash';

export interface GeneralEntityState<T> extends EntityState<T> {
    currentPageIds: (string | number)[];
    selectedRowIds: (string | number)[];
    selectedId: string | number;
    queryParams: any;
}

/**
 * Given an Entity, some Dto's (optional) and a PaginatedEntity state
 * provides all the boilerplate needed for a basic crud module
 */
export class GeneralEntityNGRX<Entity, CreateDto, UpdateDto, State extends GeneralEntityState<Entity>> {
    name: string;
    featureStateSelector: (state: State) => any;
    entityAdapter: EntityAdapter<Entity>;
    get entitySelectors() {
        return this.entityAdapter.getSelectors(this.featureStateSelector);
    }

    constructor(name: string, featureStateSelector: (state: State) => any, entityAdapter: EntityAdapter<Entity>) {
        this.name = name;
        this.featureStateSelector = featureStateSelector;
        this.entityAdapter = entityAdapter;
    }

    //////////////////////////////////////////////////////////////////
    // Entity State Actions (Data management)
    //////////////////////////////////////////////////////////////////
    get load() {
        return createAction(`[${this.name}] Load`, props<{ items: Entity[] }>());
    }
    get loadPage() {
        return createAction(`[${this.name}] Load Page`, props<{ items: Entity[] }>());
    }
    get addOne() {
        return createAction(`[${this.name}] Add One`, props<{ item: Entity }>());
    }
    get upsertOne() {
        return createAction(`[${this.name}] Upsert One`, props<{ item: Entity }>());
    }
    get upsertMany() {
        return createAction(`[${this.name}] Upsert Many`, props<{ items: Entity[] }>());
    }
    get addMany() {
        return createAction(`[${this.name}] Add Many`, props<{ items: Entity[] }>());
    }
    get updateOne() {
        return createAction(`[${this.name}] Update One`, props<{ item: Update<Entity> }>());
    }
    get updateMany() {
        return createAction(`[${this.name}] Update Many`, props<{ items: Update<Entity>[] }>());
    }
    get deleteOne() {
        return createAction(`[${this.name}] Delete One`, props<{ id: string }>());
    }
    get deleteMany() {
        return createAction(`[${this.name}] Delete Many`, props<{ ids: string[] }>());
    }
    get clear() {
        return createAction(`[${this.name}] Clear`);
    }

    //////////////////////////////////////////////////////////////////
    // Request Actions
    //////////////////////////////////////////////////////////////////
    get getManyReq() {
        return createAction(`[${this.name} API] Get All`);
    }
    get getOneReq() {
        return createAction(`[${this.name} API] Get One`, props<{ id: number }>());
    }
    get createOneReq() {
        return createAction(`[${this.name} API] Create One`, props<{ dto: CreateDto }>());
    }
    get updateOneReq() {
        return createAction(`[${this.name} API] Update One`, props<{ id: number; dto: UpdateDto }>());
    }
    get deleteOneReq() {
        return createAction(`[${this.name} API] Delete One`, props<{ id: number }>());
    }

    //////////////////////////////////////////////////////////////////
    // Paginated Table State Helpers
    //////////////////////////////////////////////////////////////////
    selectCurrentPageIds = () => {
        return createSelector(this.featureStateSelector, (state: GeneralEntityState<Entity>) => state.currentPageIds);
    };
    selectCurrentPageData = () => {
        return createSelector(this.entitySelectors.selectEntities, this.selectCurrentPageIds(), (data, currentPageIds) => {
            return currentPageIds.map((id) => data[id]).filter((entity) => !!entity);
        });
    };
    selectCurrentlySelectedRowIds = () => {
        return createSelector(this.featureStateSelector, (state: GeneralEntityState<Entity>) => state.selectedRowIds);
    };
    selectCurrentlySelectedRowData = () => {
        return createSelector(this.entitySelectors.selectEntities, this.selectCurrentlySelectedRowIds(), (data, selectedRowIds) => {
            return selectedRowIds.map((id) => data[id]).filter((entity) => !!entity);
        });
    };

    selectSelectedRowCount = () => {
        return createSelector(this.featureStateSelector, (state: GeneralEntityState<Entity>) => state.selectedRowIds.length || 0);
    };

    selectIsCurrentPageSelected = () => {
        return createSelector(this.selectCurrentlySelectedRowIds(), this.selectCurrentPageIds(), (selectedRowIds, pageIds) => {
            if (selectedRowIds.length <= 0 || pageIds.length <= 0) {
                return false;
            }
            // Selected row Ids are strings for some reason, so map to string to allow === comparison
            pageIds = pageIds.map((pageId) => `${pageId}`);
            return difference(pageIds, selectedRowIds).length <= 0;
        });
    };

    get setSelectedRowIds() {
        return createAction(`[${this.name}] Select Rows`, props<{ ids: (number | string)[] }>());
    }
    get setCurrentlySelectedId() {
        return createAction(`[${this.name}] Select One`, props<{ id: number | string }>());
    }

    //////////////////////////////////////////////////////////////////
    // Query Params
    //////////////////////////////////////////////////////////////////

    selectQueryParams = () => createSelector(this.featureStateSelector, (state: GeneralEntityState<Entity>) => state.queryParams);
    get setQueryParams() {
        return createAction(`[${this.name}] Set Query Params`, props<{ query: any }>());
    }

    //////////////////////////////////////////////////////////////////
    // Reducer
    //////////////////////////////////////////////////////////////////
    get reducerOns() {
        return [
            on(this.addOne, (state: State, action) => this.entityAdapter.addOne(action.item, state)),
            on(this.addMany, (state: State, action) => this.entityAdapter.addMany(action.items, state)),
            on(this.upsertMany, (state: State, action) => this.entityAdapter.upsertMany(action.items, state)),
            on(this.upsertOne, (state: State, action) => this.entityAdapter.upsertOne(action.item, state)),
            on(this.updateOne, (state: State, action) => this.entityAdapter.updateOne(action.item, state)),
            on(this.updateMany, (state: State, action) => this.entityAdapter.updateMany(action.items, state)),
            on(this.deleteOne, (state: State, action) => this.entityAdapter.removeOne(action.id, state)),
            on(this.deleteMany, (state: State, action) => this.entityAdapter.removeMany(action.ids, state)),
            on(this.load, (state: State, action) => this.entityAdapter.setAll(action.items, state)),
            on(this.loadPage, (state: State, action) => {
                state = this.entityAdapter.upsertMany(action.items, state);
                return {
                    ...state,
                    currentPageIds: action.items.map((item) => this.entityAdapter.selectId(item)),
                };
            }),
            on(this.clear, (state: State, action) => this.entityAdapter.removeAll(state)),
            on(this.upsertMany, (state: State, action) => this.entityAdapter.upsertMany(action.items, state)),
            on(this.setSelectedRowIds, (state: State, action) => {
                return { ...state, selectedRowIds: action.ids };
            }),
            on(this.setCurrentlySelectedId, (state: State, action) => {
                return { ...state, selectedId: action.id };
            }),
            on(this.setQueryParams, (state: State, action) => {
                return { ...state, queryParams: { ...state.queryParams, ...action.query } };
            }),
        ];
    }

    //////////////////////////////////////////////////////////////////
    // General Usage Selectors
    //////////////////////////////////////////////////////////////////
    selectEntityById = (id: number | string) => {
        return createSelector(this.entitySelectors.selectEntities, (entities) => entities[id]);
    };
    selectEntitiesByIds = (ids: (number | string)[]) => {
        return createSelector(this.entitySelectors.selectEntities, (entities) => ids.map((id) => entities[id]));
    };

    getCurrentlySelectedEntityId = () => {
        return createSelector(this.featureStateSelector, (state) => state.selectedId);
    };
    getCurrentlySelectedEntityData = () => {
        return createSelector(this.getCurrentlySelectedEntityId(), this.entitySelectors.selectEntities, (id, entities) => {
            return {
                id,
                data: entities[id],
            };
        });
    };
}
