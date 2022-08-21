import { MunicipalRedirectionDetails } from '@modules/infringement/components/check-nomination-redirection-details/municipal-redirection.details';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Expose, Transform } from 'class-transformer';
import i18next from 'i18next';

const translationKey = 'unready-batch-redirects-spreadsheet';
const yes = i18next.t(`${translationKey}.yes`);
const no = i18next.t(`${translationKey}.no`);

export class UnreadyRedirectSpreadsheetModel {
    @Transform((value: Partial<Infringement>) => value.noticeNumber)
    @Expose({ name: 'infringement' })
    'notice_number': string;

    @Transform((value: undefined, obj: MunicipalRedirectionDetails) => {
        const infringementId = obj.infringement.infringementId;
        return `${window.location.origin}/home/infringements/view/${infringementId}`;
    })
    @Expose()
    'infringement_url': string;

    @Expose({ name: 'type' })
    'redirection_type': string;

    @Transform((value: { status: boolean }) => (value.status ? yes : no))
    @Expose({ name: 'hasValidStatus' })
    'has_valid_status': string;

    @Transform((value: { status: boolean }) => (value.status ? yes : no))
    @Expose({ name: 'hasLeaseDocument' })
    'has_lease_document': string;


    @Transform((value: { status: boolean }) => (value.status ? yes : no))
    @Expose({ name: 'hasLeaseSubstituteDocument' })
    'has_lease_substitute_document': string;

    @Transform((value: { status: boolean }) => (value.status ? yes : no))
    @Expose({ name: 'hasPowerOfAttorneyDocument' })
    'has_power_of_attorney_document': string;

    @Transform((value: { status: boolean }) => (value.status ? yes : no))
    @Expose({ name: 'hasSignatureAvailable' })
    'has_signature_available': string;

    @Transform((value: { status: boolean }) => (value.status ? yes : no))
    @Expose({ name: 'hasValidRedirectionUserAddress' })
    'has_valid_user_redirection_address': string;

    @Transform((value: { status: boolean }) => (value.status ? yes : no))
    @Expose({ name: 'hasValidRedirectionOwnerAddress' })
    'has_valid_owner_redirection_address': string;

    @Expose({ name: 'message' })
    'message'?: string;
}
