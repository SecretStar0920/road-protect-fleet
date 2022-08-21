import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class PaymentEffects {
    constructor(private actions$: Actions) {}
}
