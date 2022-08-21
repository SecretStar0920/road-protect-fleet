import { Dictionary } from 'lodash';
import i18next from 'i18next';

export class LogKeysMapper {
    private keyTranslation: Dictionary<string> = {};

    constructor() {
        this.populateKeys();
    }

    getKeyTranslation(key: string): string {
        const translation = this.keyTranslation[key];
        return typeof translation === 'undefined' ? key : translation;
    }

    private populateKeys() {
        // Infringement properties
        this.keyTranslation['brn'] = i18next.t('infringement.brn');
        this.keyTranslation['type'] = i18next.t('infringement.type');
        this.keyTranslation['reason'] = i18next.t('infringement.reason');
        this.keyTranslation['status'] = i18next.t('infringement.status');
        this.keyTranslation['issuerId'] = i18next.t('infringement.issuer');
        this.keyTranslation['amountDue'] = i18next.t('infringement.amount_due');
        this.keyTranslation['vehicleId'] = i18next.t('infringement.vehicle');
        this.keyTranslation['caseNumber'] = i18next.t('infringement.case_number');
        this.keyTranslation['contractId'] = i18next.t('infringement.contract');
        this.keyTranslation['documentId'] = i18next.t('infringement.document');
        this.keyTranslation['locationId'] = i18next.t('infringement.location');
        this.keyTranslation['reasonCode'] = i18next.t('infringement.reason_code');
        this.keyTranslation['offenceDate'] = i18next.t('infringement.offence_date');
        this.keyTranslation['totalAmount'] = i18next.t('infringement.total_amount');
        this.keyTranslation['issuerStatus'] = i18next.t('infringement.issuer_status');
        this.keyTranslation['noticeNumber'] = i18next.t('infringement.notice_number');
        this.keyTranslation['systemStatus'] = i18next.t('infringement.system_status');
        this.keyTranslation['penaltyAmount'] = i18next.t('infringement.penalty_amount');
        this.keyTranslation['totalPayments'] = i18next.t('infringement.total_payments');
        this.keyTranslation['infringementId'] = i18next.t('infringement.id');
        this.keyTranslation['originalAmount'] = i18next.t('infringement.original_amount_due');
        this.keyTranslation['latestPaymentDate'] = i18next.t('infringement.latest_payment_date');
        this.keyTranslation['externalChangeDate'] = i18next.t('infringement.external_change_date');
        this.keyTranslation['lastStatusChangeDate'] = i18next.t('infringement.latest_status_change_date');
        this.keyTranslation['issuerStatusDescription'] = i18next.t('infringement.issuer_status_description');
        // Account properties
        this.keyTranslation['identifier'] = i18next.t('account.id');
        this.keyTranslation['name'] = i18next.t('account.name');
        this.keyTranslation['primaryContact'] = i18next.t('account.primary_contact');
        this.keyTranslation['active'] = i18next.t('account.active');
        this.keyTranslation['isVerified'] = i18next.t('account.verified');
        this.keyTranslation['type'] = i18next.t('account.type');
        this.keyTranslation['role'] = i18next.t('account.role');
        this.keyTranslation['details'] = i18next.t('account.details');
        this.keyTranslation['managed'] = i18next.t('account.managed');
        this.keyTranslation['physicalLocationId'] = i18next.t('account.postal_location');
        this.keyTranslation['documentId'] = i18next.t('account.document');
        this.keyTranslation['atgToken'] = i18next.t('account.atg_token');
        this.keyTranslation['rpTokenId'] = i18next.t('account.rp_token');
        this.keyTranslation['accountReporting'] = i18next.t('account.account_reporting');
        this.keyTranslation['postalLocation'] = i18next.t('account.postal_location');
        this.keyTranslation['accountMetabaseReporting'] = i18next.t('account.account_metabase_reporting');
        this.keyTranslation['fleetManagerDetails'] = i18next.t('account.fleet_manager_details');
        this.keyTranslation['requestInformationDetails'] = i18next.t('account.request_information_details');
    }
}
