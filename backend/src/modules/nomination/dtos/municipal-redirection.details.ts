import { FleetManagerDetails, Infringement, Nomination, RedirectionType } from '@entities';
import { RedirectionAddressDetails } from '@modules/nomination/services/extract-redirection-address-details.service';
import { IssuerChannels } from '@modules/shared/models/issuer-integration-details.model';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Defines whether a redirection is ready and returns additional information to understand
 */
export class MunicipalRedirectionDetails {
    @ApiProperty()
    ready: boolean;
    @ApiProperty({ enum: RedirectionType })
    type: RedirectionType;
    @ApiProperty({ description: 'Infringement' })
    infringement: Partial<Infringement>;
    @ApiProperty({ description: 'Nomination' })
    nomination: Partial<Nomination>;
    @ApiProperty({ enum: IssuerChannels })
    redirectionChannel?: IssuerChannels;

    @ApiProperty()
    message?: string;

    @ApiProperty()
    hasDriverContract?: boolean;

    @ApiProperty()
    hasValidStatus: {
        status: boolean;
        nominationStatus?: boolean;
        infringementStatus?: boolean;
    };

    @ApiProperty()
    hasLeaseDocument: {
        status: boolean;
        contractId: number;
    };

    @ApiProperty()
    hasLeaseSubstituteDocument: {
        status: boolean;
        contractId: number;
    };

    @ApiProperty()
    hasPowerOfAttorneyDocument: {
        status: boolean;
        accountId: number;
    };

    @ApiProperty()
    hasSignatureAvailable: {
        status: boolean;
        type: 'Natural' | 'RP'; // Either from the owner account or RP's
        details: FleetManagerDetails;
    };

    @ApiProperty()
    hasValidRedirectionUserAddress: {
        status: boolean;
        details: RedirectionAddressDetails;
    };

    @ApiProperty()
    hasValidRedirectionOwnerAddress: {
        status: boolean;
        details: RedirectionAddressDetails;
    };
}
