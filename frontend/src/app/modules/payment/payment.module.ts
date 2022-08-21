import * as fromPayment from '@modules/payment/ngrx/payment.reducer';
import { PaymentsPageComponent } from '@modules/payment/components/payments-page/payments-page.component';
import { CommonModule } from '@angular/common';
import { CreatePaymentComponent } from '@modules/payment/components/create-payment/create-payment.component';
import { CreatePaymentModalComponent } from '@modules/payment/components/create-payment/create-payment-modal/create-payment-modal.component';
import { CreatePaymentPageComponent } from '@modules/payment/components/create-payment/create-payment-page/create-payment-page.component';
import { DeletePaymentComponent } from './components/delete-payment/delete-payment.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdatePaymentComponent } from '@modules/payment/components/update-payment/update-payment.component';
import { ViewPaymentComponent } from '@modules/payment/components/view-payment/view-payment.component';
import { ViewPaymentModalComponent } from '@modules/payment/components/view-payment/view-payment-modal/view-payment-modal.component';
import { ViewPaymentPageComponent } from '@modules/payment/components/view-payment/view-payment-page/view-payment-page.component';
import { ViewPaymentsComponent } from '@modules/payment/components/view-payments/view-payments.component';
import { PaymentEffects } from '@modules/payment/ngrx/payment.effects';
import { DocumentModule } from '@modules/document/document.module';
import { UploadPaymentsPageComponent } from '@modules/payment/components/upload-payments-page/upload-payments-page.component';
import { ViewPaymentsAdvancedComponent } from '@modules/payment/components/view-payments-advanced/view-payments-advanced.component';
import { ViewAccountPaymentMethodsComponent } from './components/view-account-payment-methods/view-account-payment-methods.component';

@NgModule({
    declarations: [
        ViewPaymentComponent,
        ViewPaymentsComponent,
        CreatePaymentComponent,
        UpdatePaymentComponent,
        CreatePaymentModalComponent,
        CreatePaymentPageComponent,
        ViewPaymentPageComponent,
        ViewPaymentModalComponent,
        PaymentsPageComponent,
        DeletePaymentComponent,
        UploadPaymentsPageComponent,
        ViewPaymentsAdvancedComponent,
        ViewAccountPaymentMethodsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('payment', fromPayment.reducer),
        EffectsModule.forFeature([PaymentEffects]),
        DocumentModule,
    ],
    exports: [
        ViewPaymentComponent,
        ViewPaymentsComponent,
        CreatePaymentComponent,
        UpdatePaymentComponent,
        CreatePaymentModalComponent,
        CreatePaymentPageComponent,
        ViewPaymentPageComponent,
        ViewPaymentModalComponent,
        PaymentsPageComponent,
        DeletePaymentComponent,
        UploadPaymentsPageComponent,
        ViewAccountPaymentMethodsComponent,
    ],
    entryComponents: [CreatePaymentModalComponent, ViewPaymentModalComponent],
})
export class PaymentModule {}
