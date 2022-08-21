import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';

@Injectable()
export class RawInfringementLogEffects {
    constructor(private actions$: Actions, private router: Router) {}
}
