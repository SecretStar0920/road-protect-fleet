import { Timestamped } from '@modules/shared/models/timestamped';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { Account } from '@modules/shared/models/entities/account.model';

export class RequestInformationLogDetails {
    requestEmailContext: {
        accountsToRequest: Account[];
        senderAccount: Account;
        customSignature?: string;
        name: string;
        lang?: 'he' | 'en';
        customHeader?: string;
        customFooter?: string;
    };
}

export class RequestInformationLog extends Timestamped {
    requestInformationLogId: number;
    requestSendDate: string;
    responseReceivedDate?: string;
    responseReceived?: boolean;
    senderAccount: Account;
    issuer: Issuer;
    details?: RequestInformationLogDetails;
}
