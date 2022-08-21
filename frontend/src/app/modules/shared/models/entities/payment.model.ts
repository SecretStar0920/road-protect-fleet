import { Infringement } from './infringement.model';
import { plainToClass, Type } from 'class-transformer';
import { Document } from '@modules/shared/models/entities/document.model';

export enum PaymentType {
    Municipal = 'Municipal',
    Manual = 'Manual',
}

export enum MunicipalPaymentStatus {
    Pending = 'Pending',
    Successful = 'Successful',
    Failed = 'Failed',
}

export class Payment {
    paymentId: number;
    type: PaymentType;

    @Type(() => Infringement)
    infringement: Infringement;

    amountPaid: string;

    createdAt: string;

    provider?: string;

    externalReference?: string;

    paymentDate?: string;

    /**
     * Factory method for generating child classes given POJOs
     */
    static Create(...payments: Payment[]): (ManualPayment | MunicipalPayment)[] {
        const created = [];
        for (const payment of payments) {
            if (payment.type === PaymentType.Municipal) {
                created.push(plainToClass(MunicipalPayment, payment));
            } else if (payment.type === PaymentType.Manual) {
                created.push(plainToClass(ManualPayment, payment));
            }
        }
        return created;
    }
}

export class ManualPayment extends Payment {
    referenceNumber: string;

    @Type(() => Document)
    document: Document;
    details: any;
}

export class MunicipalPayment extends Payment {
    status: MunicipalPaymentStatus;
}
