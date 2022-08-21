import { InfringementStatus } from '../../shared/models/entities/infringement.model';

export const mapTranslatedToInfringementStatus: { [key: string]: InfringementStatus } = {
    'Approved for payment': InfringementStatus.ApprovedForPayment,
    'אושר לתשלום': InfringementStatus.ApprovedForPayment,
    Closed: InfringementStatus.Closed,
    סגור: InfringementStatus.Closed,
    Due: InfringementStatus.Due,
    פתוח: InfringementStatus.Due,
    Outstanding: InfringementStatus.Outstanding,
    בחריגה: InfringementStatus.Outstanding,
    Paid: InfringementStatus.Paid,
    שולם: InfringementStatus.Paid,
};
