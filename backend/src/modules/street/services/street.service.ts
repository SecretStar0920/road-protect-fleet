import { Issuer, Street } from '@entities';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import { Brackets } from 'typeorm';
import { map } from 'lodash';

export class City {
    @IsString()
    issuer: string;
    @IsString()
    code: number;
}

@Injectable()
export class StreetService {
    async getStreets(street: string, issuer: string): Promise<Street[]> {
        const query = Street.createQueryBuilder('street')
            .addSelect('street.streetId', 'streetId')
            .addSelect('street.name', 'name')
            .addSelect('street.code', 'code')
            .addSelect('street.issuer', 'issuer');

        // .leftJoinAndMapOne('issuerCode', 'issuer', 'issuer', 'street.issuer = issuer.name')

        if (street) {
            const search = `%${street}%`;
            query.where(
                new Brackets((qb) => {
                    qb.andWhere(`street.name ILIKE :search`, { search });
                }),
            );
        }

        if (issuer) {
            query.andWhere('street.issuer = :issuer', { issuer });
        }

        query.limit(15);

        return await query.getRawMany();
    }

    async getCities(): Promise<string[]> {
        const cities = await Street.createQueryBuilder('street').select('street.issuer', 'issuer').distinct(true).getRawMany();
        return map(cities, (city) => city.issuer);
    }
}
