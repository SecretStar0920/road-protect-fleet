import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Payment } from '@modules/shared/models/entities/payment.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreatePaymentDto } from '@modules/payment/services/create-payment.dto';
import { UpdatePaymentDto } from '@modules/payment/services/update-payment.dto';
import { createReducer } from '@ngrx/store';

export interface PaymentState extends GeneralEntityState<Payment> {
    // additional entities state properties
}

export const paymentEntityAdapter: EntityAdapter<Payment> = createEntityAdapter<Payment>({ selectId: (payment) => payment.paymentId });

export const initialPaymentState: PaymentState = paymentEntityAdapter.getInitialState({
    // additional entity state properties
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
    queryParams: {},
});

export const selectPaymentFeatureState = (state) => state.payment;
export const paymentNgrxHelper = new GeneralEntityNGRX<Payment, CreatePaymentDto, UpdatePaymentDto, PaymentState>(
    'Payment',
    selectPaymentFeatureState,
    paymentEntityAdapter,
);

export const paymentReducer = createReducer(initialPaymentState, ...paymentNgrxHelper.reducerOns);

export function reducer(state = initialPaymentState, action): PaymentState {
    return paymentReducer(state, action);
}
