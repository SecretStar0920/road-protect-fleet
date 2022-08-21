import { AccountRole, Client, InfringementStatus, NominationStatus } from '@entities';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { VerifyInfringementService } from '@modules/infringement/services/verify-infringement.service';
import { AtgInfringementDataService } from '@modules/partners/modules/atg/services/atg-infringement-data.service';
import { generator } from '@modules/shared/helpers/data-generators';
import { ATGIssuerIntegrationDetails } from '@modules/shared/models/issuer-integration-details.model';
import { INestApplication } from '@nestjs/common';
import * as request from 'request-promise-native';
import { getConnection } from 'typeorm';
import { runInTransaction } from 'typeorm-test-transactions';
import { TestApp } from '../helpers/test-app.singleton';

jest.mock('request-promise-native', () => {
    return {
        post: jest.fn(),
    };
});

describe('VerifyATGInfringement', () => {
    let app: INestApplication;
    let verifyInfringementService: VerifyInfringementService;
    let atgDataService: AtgInfringementDataService;
    let createInfringementService: CreateInfringementService;
    let client: Client;

    const noticeNumber = '123213';
    const registration = '123132';
    const issuerAtgCode = '261000';
    const brn = '00510242670';
    const issuerAtgName='בני ברק';

    const dummyResponse = (brnToSet: string = null) => {
        return {
            Msg: {
                RcMessage: 'נתונים נשלפו בהצלחה!',
                RcNumber: 1,
                RcOwner: 2000,
                RcType: 1,
                RcVersion: '1.0',
                RcFieldName: ' ',
            },
            Globals: {
                FileNetToken: ' ',
                IisIp: ' ',
            },
            appDataResponse: {
                ticketDetails: {
                    customer: issuerAtgCode,
                    carNumber: registration,
                    ticketNumber: noticeNumber,
                    dtViolationTime: '2020-10-01T11:50:00+03:00',
                    streetName: 'שלמה המלך        ',
                    violationNearTo: 'ליד 33',
                    sidurAvera: '801 ',
                    localLawNumber: '1ג5',
                    description: null,
                    carType: '214',
                    manufacturer: 'מרצדס-בנץ צרפת',
                    color: 'איירמצי',
                    amount: '100.0',
                    penaltyAmount: '500.0',
                    lastDateToPay: '0',
                    inspectorNumber: '220',
                    inspectorName: 'אלון אליהו',
                    dateOfFirstNotice: null,
                    driverIdNumber: brnToSet,
                    driverFirstName: null,
                    driverLastName: null,
                    driverStreetAddress: null,
                    driverHouseNumber: null,
                    driverApartment: null,
                    driverCity: null,
                    driverPostalCode: null,
                    refNumer: null,
                },
            },
        };
    };

    beforeAll(async () => {
        app = await TestApp.app();
        client = await generator.client({ name: 'atg-verification' });
        await app.init();
        // Recreating app
        verifyInfringementService = app.get(VerifyInfringementService);
        createInfringementService = app.get(CreateInfringementService);
        atgDataService = app.get(AtgInfringementDataService);
        jest.spyOn(request, 'post').mockResolvedValue(dummyResponse());
    });

    // It should not try verify a non catered for provider
    it(
        'Should throw an exception when verifying an infringement provided by a non-catered for provider',
        runInTransaction(async () => {
            const vehicle = await generator.vehicle({ registration });
            const issuer = await generator.issuer({ name: 'TEMP', provider: 'TEMP' });
            const infringement = await generator.infringement({
                noticeNumber,
                vehicle,
                issuer,
            });

            let errorMessage;
            try {
                const result = await verifyInfringementService.verifySingle(infringement.infringementId);
            } catch (e) {
                expect(e.message).toBeTruthy();
                errorMessage = e.message;
            }

            expect(errorMessage).toBe(
                `Infringement cannot be verified because infringement issuer ${issuer.provider} does not have a verifications endpoint`,
            );
        }),
    );

    // It should try to verify an atg provider
    it(
        'Should verify an ATG provided infringement',
        runInTransaction(async () => {
            const vehicle = await generator.vehicle({ registration });
            const issuer = await generator.issuer({
                name: 'ATG',
                provider: 'ATG',
                integrationDetails: {
                    code: issuerAtgCode,
                    name: issuerAtgName,
                    type: 'ATG',
                    verificationProvider: 'ATG',
                } as ATGIssuerIntegrationDetails,
            });
            const infringement = await generator.infringement({
                noticeNumber,
                vehicle,
                issuer,
            });
            const result = await verifyInfringementService.verifySingle(infringement.infringementId);
            expect(result).toBeUndefined();
        }),
    );

    // It should process the (mock) response as expected when amount due has changed
    it(
        'Should update infringement amount as expected',
        runInTransaction(async () => {
            const vehicle = await generator.vehicle({ registration });
            const issuer = await generator.issuer({
                name: 'ATG',
                provider: 'ATG',
                integrationDetails: {
                    code: issuerAtgCode,
                    name: issuerAtgName,
                    type: 'ATG',
                    verificationProvider: 'ATG',
                } as ATGIssuerIntegrationDetails,
            });
            const infringement = await generator.infringement({
                noticeNumber,
                vehicle,
                issuer,
                amountDue: '0.0',
            });
            expect(infringement.amountDue).toEqual('0.0');
            const result = await atgDataService.verifyInfringement(issuer.code, infringement.noticeNumber, vehicle.registration);
            expect(result.infringement?.amountDue).toEqual('100.00');
            expect(result.infringement?.originalAmount).toEqual('500.00');
        }),
    );

    // It should process the (mock) response as expected when the driver id field is not specified
    it(
        'Should not update the infringement status or nomination when driver id field is not set',
        runInTransaction(async () => {
            const vehicle = await generator.vehicle({ registration });
            const issuer = await generator.issuer({
                name: 'ATG',
                provider: 'ATG',
                integrationDetails: {
                    code: issuerAtgCode,
                    name: issuerAtgName,
                    type: 'ATG',
                    verificationProvider: 'ATG',
                } as ATGIssuerIntegrationDetails,
            });
            const account = await generator.account({
                role: AccountRole.Owner,
                identifier: 'test',
            });
            await generator.ownershipContract({
                owner: account,
                vehicle,
                startDate: '2020-10-01T11:00:00+03:00', // Less than offence date
            });
            const infringement = await createInfringementService.createInfringement({
                noticeNumber,
                vehicle: vehicle.registration,
                issuer: issuer.name,
                amountDue: '500.0',
                originalAmount: '500.0',
                offenceDate: '2020-10-01T11:50:00+03:00',
                city: 'test',
                country: 'test',
                brn: 'test',
            });

            expect(infringement.status).toEqual(InfringementStatus.Due);
            const result = await atgDataService.verifyInfringement(issuer.code, infringement.noticeNumber, vehicle.registration);
            const updatedInfringement = result.infringement;
            expect(updatedInfringement.status).toEqual(InfringementStatus.Due);
        }),
    );

    // It should process the (mock) response as expected when the driver id field is specified
    it(
        'Should update the infringement status and nomination as expected when driver id field is set',
        runInTransaction(async () => {
            const processedBrn = brn.replace(/^0+/g, '');
            const vehicle = await generator.vehicle({ registration });
            const issuer = await generator.issuer({
                name: 'ATG',
                provider: 'ATG',
                integrationDetails: {
                    code: issuerAtgCode,
                    name: issuerAtgName,
                    type: 'ATG',
                    verificationProvider: 'ATG',
                } as ATGIssuerIntegrationDetails,
            });
            const account = await generator.account({
                role: AccountRole.Owner,
                identifier: 'test',
            });
            await generator.account({
                role: AccountRole.Owner,
                identifier: processedBrn,
            });
            await generator.ownershipContract({
                owner: account,
                vehicle,
                startDate: '2020-10-01T11:00:00+03:00', // Less than offence date
            });
            const infringement = await createInfringementService.createInfringement({
                noticeNumber,
                vehicle: vehicle.registration,
                issuer: issuer.name,
                amountDue: '500.0',
                originalAmount: '500.0',
                offenceDate: '2020-10-01T11:50:00+03:00',
                city: 'test',
                country: 'test',
                brn: 'test',
            });
            jest.spyOn(request, 'post').mockResolvedValue(dummyResponse(brn));
            const result = await atgDataService.verifyInfringement(issuer.code, infringement.noticeNumber, vehicle.registration);
            const updatedInfringement = result.infringement;

            expect(infringement.status).toEqual(InfringementStatus.Due);
            expect(infringement.brn).toEqual('test');

            expect(updatedInfringement.brn).toEqual(processedBrn);
            expect(updatedInfringement.status).toEqual(InfringementStatus.Due);
            expect(updatedInfringement.nomination.rawRedirectionIdentifier).toEqual(processedBrn);
            expect(updatedInfringement.nomination.status).toEqual(NominationStatus.RedirectionCompleted);
        }),
    );

    afterAll(async () => {
        const connection = getConnection();
        const entities = connection.entityMetadatas;

        for (const entity of entities) {
            const repository = await connection.getRepository(entity.name);
            await repository.query(`DELETE FROM "${entity.tableName}";`);
        }
        await TestApp.closeApp();
    });
});
