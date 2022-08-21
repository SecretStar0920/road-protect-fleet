import { createAction, props } from '@ngrx/store';

export class RequestAction<Model, RequestDto> {
    constructor(private moduleName: string, private actionName: string) {}

    request = createAction(`[${this.moduleName}] ${this.actionName} Request`, props<{ request?: RequestDto }>());

    success = createAction(`[${this.moduleName}] ${this.actionName} Success`, props<{ result: Model }>());

    failure = createAction(`[${this.moduleName}] ${this.actionName} Failure`, props<{ error: any }>());
}
