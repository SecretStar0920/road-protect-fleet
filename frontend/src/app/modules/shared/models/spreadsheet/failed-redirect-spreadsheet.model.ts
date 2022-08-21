import { MunicipalRedirectionDetails } from '@modules/infringement/components/check-nomination-redirection-details/municipal-redirection.details';
import { IStandardError } from '@modules/shared/models/element-state.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Expose, Transform } from 'class-transformer';

export class FailedRedirectSpreadsheetModel {
    @Transform((value: Partial<Infringement>) => value.noticeNumber)
    @Expose({ name: 'infringement' })
    'notice_number': string;

    @Transform((value: undefined, obj: MunicipalRedirectionDetails) => {
        const infringementId = obj.infringement.infringementId;
        return `${window.location.origin}/home/infringements/view/${infringementId}`;
    })
    @Expose()
    'infringement_url': string;

    @Transform((value: IStandardError) => value.message)
    @Expose({ name: 'error' })
    'error'?: string;
}
