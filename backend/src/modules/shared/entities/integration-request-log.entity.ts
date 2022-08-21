import { TimeStamped } from '@entities';
import { Column, Entity, Index, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum Integration {
    AutomationAddVehicle = 'AUTOMATION_ADD_VEHICLE',
    AutomationCreditGuardPay = 'AUTOMATION_CREDIT_GUARD_PAY',
    AutomationCreditGuardRequestToken = 'AUTOMATION_CREDIT_GUARD_REQUEST_TOKEN',
    AutomationRedirectInfringement = 'AUTOMATION_REDIRECT_INFRINGEMENT',
    AutomationUpdateVehicle = 'AUTOMATION_UPDATE_VEHICLE',
    AutomationVerifyInfringement = 'AUTOMATION_VERIFY_INFRINGEMENT',
    AutomationVerifyInfringementSum = 'AUTOMATION_VERIFY_INFRINGEMENT_SUM',
    IsraelGovernmentLocalities = 'ISRAEL_GOVERNMENT_LOCALITIES',
    IsraelGovernmentStreetCodes = 'ISRAEL_GOVERNMENT_STREET_CODES',
    IturanVehicleLocation = 'ITURAN_VEHICLE_LOCATION',
    OldFleetInfringementData = 'OLD_FLEET_INFRINGEMENT_DATA',
    RoadProtectCreditGuardRequestToken = 'RP_CREDIT_GUARD_REQUEST_TOKEN',
    RoadProtectCreditGuardPay = 'RP_CREDIT_GUARD_PAY',
    JerusalemVerifyInfringement = 'JERUSALEM_VERIFY_INFRINGEMENT',
    TelavivVerifyInfringement = 'TELAVIV_VERIFY_INFRINGEMENT',
    MileonVerifyInfringement = 'MILEON_VERIFY_INFRINGEMENT',
    MetroparkVerifyInfringement = 'METROPARK_VERIFY_INFRINGEMENT',
    KfarSabaVerifyInfringement = 'KFARSABA_VERIFY_INFRINGEMENT',
    PoliceVerifyInfringement = 'POLICE_VERIFY_INFRINGEMENT',
    ShoharVerifyInfringement = 'SHOHAR_VERIFY_INFRINGEMENT',
    City4uVerifyInfringement = 'CITY4U_VERIFY_INFRINGEMENT',
    ContractOCR = 'CONTRACT_OCR',
    TelavivRedirectInfringement = 'TELAVIV_REDIRECT_INFRINGEMENT',
    JerusalemRedirectInfringement = 'JERUSALEM_REDIRECT_INFRINGEMENT',
    PoliceRedirectInfringement = 'POLICE_REDIRECT_INFRINGEMENT',
    MileonRedirectInfringement = 'MILEON_REDIRECT_INFRINGEMENT',
    MetroparkRedirectInfringement = 'Metropark_REDIRECT_INFRINGEMENT',
    KfarSabaRedirectInfringement = 'KfarSaba_REDIRECT_INFRINGEMENT',
    City4uRedirectInfringement = 'CITY4U_REDIRECT_INFRINGEMENT',
    PartialInfringement = 'PARTIAL_INFRINGEMENT',
    PartialInfringementOCR = 'PARTIAL_INFRINGEMENT_OCR',
}

@Entity()
export class IntegrationRequestLog extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    integrationRequestLogId: number;

    @Column('bool', { default: true })
    @ApiProperty()
    success?: boolean;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    request: any;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    response: any;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    details: any;

    @Column('enum', { enum: Integration })
    @ApiProperty({ enum: Integration })
    type: Integration;

    static findWithMinimalRelations(): SelectQueryBuilder<IntegrationRequestLog> {
        return this.createQueryBuilder('integrationRequestLog');
    }
}
