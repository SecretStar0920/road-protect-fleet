import { Brackets, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Infringement, Street, TimeStamped } from '@entities';
import { IssuerIntegrationDetails } from '@modules/shared/models/issuer-integration-details.model';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { RequestInformationLog } from '@modules/shared/entities/request-information-log.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum IssuerType {
    Municipal = 'Municipal',
    Regional = 'Regional',
    Local = 'Local',
    Locality = 'Locality',
}

export const ISSUER_CONSTRAINTS: IDatabaseConstraints = {
    name: {
        keys: ['name'],
        constraint: 'unique_issuer_name',
        description: 'A issuer with this name already exists',
    },
    code: {
        keys: ['code', 'type'],
        constraint: 'unique_issuer_code',
        description: 'A issuer with this code already exists for this issuer type',
    },
};

@Entity()
@Unique(ISSUER_CONSTRAINTS.name.constraint, ISSUER_CONSTRAINTS.name.keys)
@Unique(ISSUER_CONSTRAINTS.code.constraint, ISSUER_CONSTRAINTS.code.keys)
export class Issuer extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    issuerId: number;

    @Column('text')
    @ApiProperty()
    name: string;

    @Column('text')
    @ApiProperty()
    code: string;

    @Column('enum', { enum: IssuerType, default: IssuerType.Municipal })
    @ApiProperty({ enum: IssuerType })
    type: IssuerType;

    @Column('text', { nullable: true })
    @ApiProperty()
    address: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    email: string;
    
    @Column('text', { nullable: true })
    @ApiProperty()
    redirectionEmail: string;
 
    @Column('text', { nullable: true })
    @ApiProperty()
    externalPaymentLink: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    fax: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    telephone: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    contactPerson: string;

    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty()
    latestInfoDate: string;

    @OneToMany((type) => Street, (street) => street.issuer)
    @ApiProperty({ type: 'object', description: 'Street[]' })
    streets: Street[];

    @ManyToOne((type) => Issuer, (issuer) => issuer.localities, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    @JoinColumn({ referencedColumnName: 'name', name: 'authority' })
    @ApiProperty({ type: 'object', description: 'Issuer' })
    authority: Issuer;

    @OneToMany((type) => Issuer, (issuer) => issuer.authority)
    @ApiProperty({ type: 'object', description: 'Issuer' })
    localities: Issuer;

    @Column('text', { nullable: true })
    @ApiProperty()
    provider: string;

    @Column('jsonb', { nullable: true })
    @ApiProperty({ type: () => IssuerIntegrationDetails })
    integrationDetails: IssuerIntegrationDetails;

    @OneToMany((type) => Infringement, (infringement) => infringement.issuer)
    @ApiProperty({ type: 'object', description: 'Infringement[]' })
    infringements: Infringement[];

    @OneToMany((type) => RequestInformationLog, (informationLRequestLog) => informationLRequestLog.issuer)
    @ApiProperty({ description: 'RequestInformationLog[]' })
    issuerRequestInformationLog: RequestInformationLog[];

    @Column('jsonb', { default: {}, select: false })
    @ApiProperty()
    dump: any;

    // Soft delete
    @Column('bool', { default: true })
    @ApiProperty()
    active: boolean;

    static async findByNameOrCode(idOrName: string | number): Promise<Issuer> {
        const query = this.getRepository()
            .createQueryBuilder('issuer')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('issuer.name = :idOrName', { idOrName });
                    qb.orWhere('issuer.code = :idOrName', { idOrName });
                }),
            );

        return query.getOne();
    }

    static findWithMinimalRelations() {
        return this.createQueryBuilder('issuer').leftJoinAndSelect('issuer.authority', 'authority');
    }
}
