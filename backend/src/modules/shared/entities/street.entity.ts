import { Column, Entity, Index, PrimaryGeneratedColumn, SelectQueryBuilder, Unique } from 'typeorm';
import { TimeStamped } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { IsraelGovernmentDataIntegration } from '@modules/location/services/israel-government-data.integration';
import { chunk } from 'lodash';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['name', 'issuer'])
export class Street extends TimeStamped {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    streetId: number;

    @Column('text')
    @Index()
    @ApiProperty()
    name: string;

    @Column('text')
    @Index()
    @ApiProperty()
    code: string;

    // @ManyToOne((type) => Issuer, (issuer) => issuer.streets, { nullable: false })
    // @JoinColumn({ name: 'issuer_name', referencedColumnName: 'name' })
    // @Index()
    // issuer: Issuer;

    // @ManyToOne((type) => Issuer, (issuer) => issuer.streets, { nullable: false })
    // @JoinColumn({ name: 'issuer_name', referencedColumnName: 'name' })
    @Column('text')
    @Index()
    @ApiProperty()
    issuer: string;

    static getByStreetAndCity(streetName: string, city: string): SelectQueryBuilder<Street> {
        return this.createQueryBuilder('street')
            .where('street.name = :streetName', { streetName })
            .andWhere('street.issuer = :issuerName', { issuerName: city });
    }

    @Transactional()
    static async syncStreetCodesIsrael() {
        const dataIntegration = new IsraelGovernmentDataIntegration();
        const data = await dataIntegration.getStreetCodes();
        if (!data.success) {
            return;
        }

        // Create a street for each one
        const streets = await Street.create(
            data.result.records.map((raw) => {
                return {
                    // tslint:disable-next-line:no-string-literal
                    name: raw['שם_רחוב'],
                    // tslint:disable-next-line:no-string-literal
                    code: `${raw['סמל_רחוב']}`,
                    // tslint:disable-next-line:no-string-literal
                    issuer: raw['שם_ישוב'],
                };
            }),
        );

        const batchedStreets = chunk(streets, 100);
        await Street.clear();
        for (const batch of batchedStreets) {
            await Street.save(batch);
        }
    }
}
