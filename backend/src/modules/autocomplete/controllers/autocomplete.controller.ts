import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BaseEntity, Brackets } from 'typeorm';
import { IsDefined, IsIn, IsString } from 'class-validator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Transform } from 'class-transformer';
import {
    Account,
    Driver,
    Infringement,
    Issuer,
    Job,
    Nomination,
    PhysicalLocation,
    RawInfringement,
    Street,
    User,
    Vehicle,
} from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export const AUTOCOMPLETE_ENTITIES: { [entity: string]: { entity: typeof BaseEntity; fields: string[] } } = {
    account: {
        entity: Account,
        fields: ['identifier', 'name'],
    },
    user: {
        entity: User,
        fields: ['email', 'name', 'surname'],
    },
    driver: {
        entity: Driver,
        fields: ['idNumber', 'licenseNumber'],
    },
    infringement: {
        entity: Infringement,
        fields: ['noticeNumber', 'brn','infringementId'],
    },
    vehicle: {
        entity: Vehicle,
        fields: ['registration'],
    },
    issuer: {
        entity: Issuer,
        fields: ['name', 'provider'],
    },
    location: {
        entity: PhysicalLocation,
        fields: ['city', 'country', 'streetName', 'code'],
    },
    street: {
        entity: Street,
        fields: ['streetId', 'name', 'code', 'issuer'],
    },
    nomination: {
        entity: Nomination,
        fields: ['rawRedirectionIdentifier'],
    },
    rawInfringement: {
        entity: RawInfringement,
        fields: ['noticeNumber'],
    },
    job: {
        entity: Job,
        fields: ['uuid', 'type'],
    },
};

export class GetAutocompleteOptionsDto {
    @IsIn(Object.keys(AUTOCOMPLETE_ENTITIES), { message: 'Invalid base datatable for autocompletion' })
    @Transform((val) => (val ? val : null))
    entity: string;

    @IsDefined()
    @IsString()
    field: string;

    @IsDefined()
    @IsString()
    search: string;
}

@Controller('autocomplete')
@UseGuards(UserAuthGuard)
export class AutocompleteController {
    @Get(':entity/:field/:search')
    async getAutocompleteOptions(@Param() params: GetAutocompleteOptionsDto) {
        const autocompleteEntity = AUTOCOMPLETE_ENTITIES[params.entity];
        const isValidField = autocompleteEntity.fields.includes(params.field);
        if (!isValidField) {
            throw new BadRequestException({ message: ERROR_CODES.E040_NotAutocompletableField.message() });
        }
        const search = `%${params.search}%`;

        // Check field
        const options = await autocompleteEntity.entity
            .createQueryBuilder('entity')
            .select(`entity.${params.field}`, 'field')
            .where(
                new Brackets((qb) => {
                    qb.andWhere(`entity.${params.field} ILIKE :search`, { search });
                }),
            )
            .distinct(true)
            .limit(15)
            .getRawMany();
        return options.map((option) => option.field);
    }
}
