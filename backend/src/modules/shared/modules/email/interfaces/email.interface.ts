import { Account } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

export class EmailContext {
    @ApiProperty()
    name: string;
    @ApiProperty()
    lang?: 'he' | 'en' = 'en';
    @ApiProperty()
    customHeader?: string;
    @ApiProperty()
    customFooter?: string;
}

export class ClusterNodeChangeEmail extends EmailContext {
    @ApiProperty()
    internalIP: string;
}

export class UserCreationEmail extends EmailContext {
    @ApiProperty()
    inviter?: string = 'an Admin';
    @ApiProperty()
    password: string;
    @ApiProperty()
    link: string;
}

export class ForgotPasswordEmail extends EmailContext {
    @ApiProperty()
    name: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    jwt: string;
    @ApiProperty()
    link: string;
}

export class AccountInvitationEmail extends EmailContext {
    @ApiProperty()
    roleName: string;
    @ApiProperty()
    accountName: string;
    @ApiProperty()
    link: string;
}

export class AccountUserRoleChangeEmail extends EmailContext {
    @ApiProperty()
    roleName: string;
    @ApiProperty()
    accountName: string;
}

export class AccountRemovalEmail extends EmailContext {
    @ApiProperty()
    accountName: string;
}

export class AccountReportEmail extends EmailContext {
    report: any
    customSignature: string
}


export class VehicleAdditionEmail extends EmailContext {
    @ApiProperty()
    vehicleRegistration: string;
    @ApiProperty()
    accountName: string;
    @ApiProperty()
    type: string;
}

export class VehicleLeaseNotificationEmail extends EmailContext {
    @ApiProperty()
    message: string;
}

export class FailedPaymentUserEmail extends EmailContext {
    @ApiProperty()
    paymentDate: string;
    @ApiProperty()
    paymentId: string;
    @ApiProperty()
    infringementNoticeNumber: string;
}

export class FailedPaymentAdminEmail extends EmailContext {
    @ApiProperty()
    userName: string;
    @ApiProperty()
    userEmail: string;
    @ApiProperty()
    errorMessage: string;
}

export class InfringementReportsEmail extends EmailContext {
    @ApiProperty()
    customSignature?: string;
    @ApiProperty()
    emailBody?: string;
}

export class RequestInformationFromIssuerEmail extends EmailContext {
    @ApiProperty({ type: 'object', description: 'Account[]' })
    accountsToRequest: Account[];
    @ApiProperty({ type: 'object', description: 'Account' })
    senderAccount: Account;
    @ApiProperty()
    customSignature?: string;
}

export class MunicipalRedirectionEmail extends EmailContext {
    @ApiProperty()
    issuerName: string;
    @ApiProperty()
    vehicleRegistration: string;
    @ApiProperty()
    noticeNumber: string;
    @ApiProperty()
    ownerName: string;
    @ApiProperty()
    ownerIdentifier: string;
    @ApiProperty()
    targetName: string;
    @ApiProperty()
    targetIdentifier: string;
}

export class AccountRelationGenerationEmail extends EmailContext {
    accountId: string;
    newClients: string[];
    deleteClients: string[];
    errors: string[];
}
