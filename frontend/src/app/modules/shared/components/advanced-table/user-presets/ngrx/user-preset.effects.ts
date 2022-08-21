import { catchError, concatMap, map } from 'rxjs/operators';
import { UserState } from '@modules/user/ngrx/user.reducer';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserPresetService } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { Store } from '@ngrx/store';
import {
    requestDeleteUserPresets,
    requestSaveUserPresets,
    requestUserPresets,
    setCurrentColumns,
    setCurrentColumnsNames,
} from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import i18next from 'i18next';

@Injectable()
export class UserPresetEffects {
    getUserPresets = createEffect(() =>
        this.actions$.pipe(
            ofType(requestUserPresets.request),
            concatMap(() =>
                this.userPresetService.getUserPreset().pipe(
                    map((result) => {
                        return requestUserPresets.success({ result });
                    }),
                    catchError((error) => of(requestUserPresets.failure({ error }))),
                ),
            ),
        ),
    );

    saveUserPresets = createEffect(() =>
        this.actions$.pipe(
            ofType(requestSaveUserPresets.request),
            concatMap((action) => {
                return this.userPresetService.upsertUserPreset(action.request).pipe(
                    map((result) => {
                        this.message.success(i18next.t('update-preset.success'));
                        return requestSaveUserPresets.success({ result });
                    }),
                    catchError((error) => {
                        this.message.error(i18next.t('update-preset.fail'));
                        return of(requestSaveUserPresets.failure({ error }));
                    }),
                );
            }),
        ),
    );

    setColumns = createEffect(() => {
        return this.actions$.pipe(
            ofType(setCurrentColumns),
            concatMap((action) => {
                return this.userPresetService.convertColumns(action.columns).pipe(
                    map((result) => {
                        return setCurrentColumnsNames({ columns: result });
                    }),
                );
            }),
        );
    });

    deleteUserPresets = createEffect(() =>
        this.actions$.pipe(
            ofType(requestDeleteUserPresets.request),
            concatMap((action) => {
                return this.userPresetService.deleteUserPreset(action.request).pipe(
                    map((result) => {
                        return requestDeleteUserPresets.success({ result });
                    }),
                    catchError((error) => of(requestDeleteUserPresets.failure({ error }))),
                );
            }),
        ),
    );

    constructor(
        private actions$: Actions,
        private store: Store<UserState>,
        private userPresetService: UserPresetService,
        private message: NzMessageService,
    ) {}
}
