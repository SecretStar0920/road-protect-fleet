import { InfringementVerificationProvider } from '@config/infringement';
import { plainToClass } from 'class-transformer';
import { IsBoolean, IsDefined, IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum IssuerIntegrationType {
    None = 'None',
    ATG = 'ATG',
    Jerusalem = 'Jerusalem',
    Telaviv = 'Telaviv',
    Mileon = 'Mileon',
    Metropark = 'Metropark',
    KfarSaba = 'KfarSaba',
    Police = 'Police',
    Shohar = 'Shohar',
    City4u = 'City4u',
}

export enum IssuerChannels {
    crawler = 'crawler',
    physicalMail = 'physical mail',
    email = 'email',
    city4u = 'city4u',
}

export abstract class IssuerIntegrationDetails {
    @ApiProperty({ enum: IssuerIntegrationType })
    abstract type: IssuerIntegrationType;
    @ApiProperty({ enum: InfringementVerificationProvider })
    abstract verificationProvider: InfringementVerificationProvider;
    @ApiProperty()
    code?: string;
    @ApiProperty()
    name?: string;
    @ApiProperty({ type: 'object' })
    channels?: {
        verifications?: IssuerChannels;
        payments?: IssuerChannels;
        redirections?: IssuerChannels;
    };
}

export abstract class ExternalIssuerIntegrationDetails extends IssuerIntegrationDetails {
    @ApiProperty()
    code: string;
}

export class ATGIssuerIntegrationDetails extends ExternalIssuerIntegrationDetails {
    @IsDefined()
    @IsIn(Object.values(IssuerIntegrationType))
    @ApiProperty()
    type = IssuerIntegrationType.ATG;
    @IsDefined()
    @IsString()
    @ApiProperty()
    code: string;
    @IsDefined()
    @IsString()
    @ApiProperty()
    name: string;
    @IsBoolean()
    @IsDefined()
    @ApiProperty()
    isPCI: number = 0;
    @IsBoolean()
    @IsDefined()
    @ApiProperty()
    isSignedUpWithRoadProtect: boolean = false;
    @IsDefined()
    @IsString()
    @ApiProperty()
    verificationProvider = InfringementVerificationProvider.ATG;
}
export class JerusalemIssuerIntegrationDetails extends IssuerIntegrationDetails {
    @IsDefined()
    @IsIn(Object.values(IssuerIntegrationType))
    @ApiProperty()
    type = IssuerIntegrationType.Jerusalem;

    @IsDefined()
    @IsString()
    @ApiProperty()
    verificationProvider = InfringementVerificationProvider.Jerusalem;
}

export class TelavivIssuerIntegrationDetails extends IssuerIntegrationDetails {
    @IsDefined()
    @IsIn(Object.values(IssuerIntegrationType))
    @ApiProperty()
    type = IssuerIntegrationType.Telaviv;

    @IsDefined()
    @IsString()
    @ApiProperty()
    verificationProvider = InfringementVerificationProvider.Telaviv;
}

export class MileonIssuerIntegrationDetails extends ExternalIssuerIntegrationDetails {
    @IsDefined()
    @IsIn(Object.values(IssuerIntegrationType))
    @ApiProperty()
    type = IssuerIntegrationType.Mileon;

    @IsDefined()
    @IsString()
    @ApiProperty()
    verificationProvider = InfringementVerificationProvider.Mileon;

    @IsDefined()
    @IsString()
    @ApiProperty()
    code: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    name: string;
}

export class MetroparkIssuerIntegrationDetails extends ExternalIssuerIntegrationDetails {
    @IsDefined()
    @IsIn(Object.values(IssuerIntegrationType))
    @ApiProperty()
    type = IssuerIntegrationType.Metropark;

    @IsDefined()
    @IsString()
    @ApiProperty()
    verificationProvider = InfringementVerificationProvider.Metropark;

    @IsDefined()
    @IsString()
    @ApiProperty()
    code: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    name: string;
}

export class KfarSabaIssuerIntegrationDetails extends ExternalIssuerIntegrationDetails {
    @IsDefined()
    @IsIn(Object.values(IssuerIntegrationType))
    @ApiProperty()
    type = IssuerIntegrationType.KfarSaba;
    @IsString()
    @ApiProperty()
    verificationProvider = InfringementVerificationProvider.KfarSaba;

    @IsDefined()
    @IsString()
    @ApiProperty()
    code: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    name: string;
}

export class PoliceIssuerIntegrationDetails extends IssuerIntegrationDetails {
    @IsDefined()
    @IsIn(Object.values(IssuerIntegrationType))
    @ApiProperty()
    type = IssuerIntegrationType.Police;

    @IsDefined()
    @IsString()
    @ApiProperty()
    verificationProvider = InfringementVerificationProvider.Police;
}

export function IssuerIntegrationDetailsFactory(details: IssuerIntegrationDetails) {
    if (!details) {
        return null;
    }
    if (details.type === IssuerIntegrationType.None) {
        return null;
    } else if (details.type === IssuerIntegrationType.ATG) {
        return plainToClass(ATGIssuerIntegrationDetails, details);
    }
}
