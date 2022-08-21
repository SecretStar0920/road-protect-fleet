import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class LocationEffects {
    constructor(private actions$: Actions) {}
}
