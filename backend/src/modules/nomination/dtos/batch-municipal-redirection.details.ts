import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { ApiProperty } from '@nestjs/swagger';

export class BatchMunicipalRedirectionDetails {
    @ApiProperty()
    ready: {
        redirections: MunicipalRedirectionDetails[];
        summary?: any;
        redirectToDriver: number[];
    };
    @ApiProperty()
    unready: {
        redirections: MunicipalRedirectionDetails[];
        summary?: any;
    };
}
