import { RawLocationParserHelper } from '@entities';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/controllers/create-location-detailed.dto';
import * as faker from 'faker';
import { plainToClass } from 'class-transformer';
import { TestApp } from '../helpers/test-app.singleton';

describe('RawLocationParser', () => {
    beforeAll(async () => {});

    describe('Parse Raw Address', () => {
        it('Should parse the following raw addresses as expected', () => {
            const inputA = 'המלך דוד מול 519';
            const outputA = RawLocationParserHelper.parseRawAddress(inputA);
            expect(outputA.streetNumber).toEqual('519');
            expect(outputA.streetName).toEqual('המלך דוד מול');
            expect(outputA.postOfficeBox).toBeUndefined();

            const inputB = 'ת.ד. 3065';
            const outputB = RawLocationParserHelper.parseRawAddress(inputB);
            expect(outputB.streetNumber).toBeUndefined();
            expect(outputB.streetName).toBeUndefined();
            expect(outputB.postOfficeBox).toEqual('3065');

            const inputC = 'על פרשת דרכים בתחום תל אביב';
            const outputC = RawLocationParserHelper.parseRawAddress(inputC);
            expect(outputC.streetNumber).toBeUndefined();
            expect(outputC.streetName).toBeUndefined();
            expect(outputC.postOfficeBox).toBeUndefined();
        });

        it('Should remove the city from the street address', () => {
            const inputA = 'אהרונוביץ 16  בני ברק';
            const cityName = 'בני ברק';
            const outputA = RawLocationParserHelper.parseRawAddress(inputA, cityName);
            expect(outputA.streetNumber).toEqual('16');
            expect(outputA.streetName).toEqual('אהרונוביץ');
            expect(outputA.city).toEqual('בני ברק');
            expect(outputA.postOfficeBox).toBeUndefined();
        });
    });

    describe('Map to Detailed Dto', () => {
        it('Should parse the following raw addresses as expected', () => {
            const streetName: string = faker.address.streetName();
            const streetNumber: string = faker.random.number(1000).toString();
            const rawPhysical: CreateLocationSingleDto = plainToClass(CreateLocationSingleDto, {
                rawAddress: `${streetName} ${streetNumber}`,
                streetNumber,
                city: faker.address.city(),
                country: faker.address.country(),
                code: faker.random.number(9999).toString(),
            });

            const detailedPhysical: CreateLocationDetailedDto = RawLocationParserHelper.parseCreateDto(rawPhysical);

            expect(detailedPhysical instanceof CreateLocationDetailedDto).toBeTruthy();
            expect(detailedPhysical.streetName).toEqual(streetName);
            expect(detailedPhysical.streetNumber).toEqual(streetNumber);
            expect(detailedPhysical.postOfficeBox).toBeUndefined();

            const rawPostal: CreateLocationSingleDto = plainToClass(CreateLocationSingleDto, {
                rawAddress: `ת.ד. 3065`,
                city: faker.address.city(),
                country: faker.address.country(),
                code: faker.random.number(9999).toString(),
            });

            const detailedPostal: CreateLocationDetailedDto = RawLocationParserHelper.parseCreateDto(rawPostal);

            expect(detailedPostal instanceof CreateLocationDetailedDto).toBeTruthy();
            expect(detailedPostal.streetName).toBeUndefined();
            expect(detailedPostal.streetNumber).toBeUndefined();
            expect(detailedPostal.postOfficeBox).toEqual('3065');
        });
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
