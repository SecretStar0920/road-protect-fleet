import { createSelector } from '@ngrx/store';
import { paymentEntityAdapter, selectPaymentFeatureState } from '@modules/payment/ngrx/payment.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } = paymentEntityAdapter.getSelectors(selectPaymentFeatureState);

export const getPaymentById = (paymentId: number) => {
    return createSelector(selectEntities, (paymentEntities) => paymentEntities[paymentId]);
};
