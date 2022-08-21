import { generator } from '@modules/shared/helpers/data-generators';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { INestApplication } from '@nestjs/common';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import * as moment from 'moment';
import * as faker from 'faker';
import { plainToClass } from 'class-transformer';
import { runInTransaction } from 'typeorm-test-transactions';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import { TestApp } from '../helpers/test-app.singleton';
import { InfringementStatus, NominationStatus } from '@entities';
import { UpdateInfringementService } from '@modules/infringement/services/update-infringement.service';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { waitForDebugger } from '../helpers/wait-for-debugger';
import { UpsertInfringementDto } from '@modules/infringement/controllers/upsert-infringement.dto';
import { UpsertInfringementService } from '@modules/infringement/services/upsert-infringement.service';
jest.setTimeout(300000);

describe('Infringement Scenarios', () => {
    let app: INestApplication;
    let createInfringementService: CreateInfringementService;
    let createLeaseContractService: CreateLeaseContractService;
    let updateInfringementService: UpdateInfringementService;
    let upsertInfringementService: UpsertInfringementService;

    beforeAll(async () => {
        app = await TestApp.app();
        createInfringementService = app.get(CreateInfringementService);
        createLeaseContractService = app.get(CreateLeaseContractService);
        updateInfringementService = app.get(UpdateInfringementService);
        upsertInfringementService = app.get(UpsertInfringementService);
    });

    it(
        `Does not reset the approved for payment flag on infringements when a standard update comes in`,
        runInTransaction(async () => {
            const vehicle = await generator.vehicle();
            const owner = await generator.account();
            const ownershipContract = await generator.ownershipContract({
                vehicle,
                owner,
                endDate: moment().add(3, 'years').toISOString(),
                startDate: moment().subtract(3, 'years').toISOString(),
            });
            const user = await generator.account();
            const leaseContract = await generator.leaseContract({
                user,
                owner,
                vehicle,
                endDate: moment().add(3, 'years').toISOString(),
                startDate: moment().subtract(3, 'years').toISOString(),
            });
            const issuer = await generator.issuer();
            const offenceDate = moment().toISOString();
            const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                noticeNumber: 'noticenumber14325',
                issuer: issuer.name,
                vehicle: vehicle.registration,
                amountDue: '500.00',
                originalAmount: '500.00',
                offenceDate,
                streetName: faker.address.streetName(),
                streetNumber: `${faker.random.number(400)}`,
                country: 'South Africa',
                brn: owner.identifier,
            });

            const infringement = await createInfringementService.createInfringement(infringementData);
            expect(infringement.infringementId).toBeTruthy();
            expect(infringement.nomination.nominationId).toBeTruthy();

            // Set the infringement to approved for payment
            infringement.approvedDate = moment().toISOString();
            infringement.status = InfringementStatus.ApprovedForPayment;
            await infringement.nomination.save();

            const updateDto = plainToClass(UpdateInfringementDto, {
                amountDue: '500.00',
                brn: null,
                caseNumber: null,
                city: 'ירושלים',
                country: 'ישראל',
                dateRedirectionCompleted: null,
                isExternal: true,
                issuer: issuer.code,
                issuerStatus: 'פתוח',
                issuerStatusDescription: null,
                latestPaymentDate: moment().add(3, 'months').toISOString(),
                noticeNumber: 'noticenumber14325',
                offenceDate,
                paymentDate: null,
                rawAddress: 'הורקניה',
                reason: 'צומת',
                reasonCode: null,
                redirectionIdentifier: null,
                redirectionLetterSendDate: null,
                redirectionType: 'External',
                streetName: 'הורקניה',
                timezone: 'Asia/Jerusalem',
            });
            const updatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, updateDto);

            expect(updatedInfringement.status).toBe(InfringementStatus.ApprovedForPayment);
        }),
    );

    it(
        `Does not change the status if it was "Redirection in Process" and it is now "Acknowledged"`,
        runInTransaction(async () => {
            const vehicle = await generator.vehicle();
            const owner = await generator.account();
            const ownershipContract = await generator.ownershipContract({
                vehicle,
                owner,
                endDate: moment().add(3, 'years').toISOString(),
                startDate: moment().subtract(3, 'years').toISOString(),
            });
            const user = await generator.account();
            const leaseContract = await generator.leaseContract({
                user,
                owner,
                vehicle,
                endDate: moment().add(3, 'years').toISOString(),
                startDate: moment().subtract(3, 'years').toISOString(),
            });
            const issuer = await generator.issuer();
            const offenceDate = moment().toISOString();
            const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                noticeNumber: 'noticenumber14325',
                issuer: issuer.name,
                vehicle: vehicle.registration,
                amountDue: '500.00',
                originalAmount: '500.00',
                offenceDate,
                streetName: faker.address.streetName(),
                streetNumber: `${faker.random.number(400)}`,
                country: 'South Africa',
                brn: owner.identifier,
                issuerStatus: NominationStatus.InRedirectionProcess,
            });

            const infringement = await createInfringementService.createInfringement(infringementData);
            expect(infringement.infringementId).toBeTruthy();
            expect(infringement.nomination.nominationId).toBeTruthy();
            expect(infringement.nomination.status).toBe(NominationStatus.InRedirectionProcess);

            const updateDto = plainToClass(UpdateInfringementDto, {
                amountDue: '500.00',
                brn: null,
                caseNumber: null,
                city: 'ירושלים',
                country: 'ישראל',
                dateRedirectionCompleted: null,
                isExternal: true,
                issuer: issuer.code,
                issuerStatus: 'פתוח',
                issuerStatusDescription: null,
                latestPaymentDate: moment().add(3, 'months').toISOString(),
                noticeNumber: 'noticenumber14325',
                offenceDate,
                paymentDate: null,
                rawAddress: 'הורקניה',
                reason: 'צומת',
                reasonCode: null,
                redirectionIdentifier: null,
                redirectionLetterSendDate: null,
                redirectionType: 'External',
                streetName: 'הורקניה',
                timezone: 'Asia/Jerusalem',
            });
            const updatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, updateDto);

            expect(updatedInfringement.nomination.status).toBe(NominationStatus.InRedirectionProcess);
        }),
    );

    it(
        `Stores the raw redirection identifier on an infringement`,
        runInTransaction(async () => {
            const vehicle = await generator.vehicle();
            const owner = await generator.account();
            const ownershipContract = await generator.ownershipContract({
                vehicle,
                owner,
                endDate: moment().add(3, 'years').toISOString(),
                startDate: moment().subtract(3, 'years').toISOString(),
            });
            const user = await generator.account();
            const leaseContract = await generator.leaseContract({
                user,
                owner,
                vehicle,
                endDate: moment().add(3, 'years').toISOString(),
                startDate: moment().subtract(3, 'years').toISOString(),
            });
            const issuer = await generator.issuer();
            const offenceDate = moment().toISOString();
            const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                noticeNumber: 'noticenumber14325',
                issuer: issuer.name,
                vehicle: vehicle.registration,
                amountDue: '500.00',
                originalAmount: '500.00',
                offenceDate,
                streetName: faker.address.streetName(),
                streetNumber: `${faker.random.number(400)}`,
                country: 'South Africa',
                brn: owner.identifier,
                issuerStatus: 'Open',
            });

            const infringement = await createInfringementService.createInfringement(infringementData);
            expect(infringement.infringementId).toBeTruthy();
            expect(infringement.nomination.nominationId).toBeTruthy();
            expect(infringement.nomination.status).toBe(NominationStatus.Acknowledged);

            const updateDto = plainToClass(UpdateInfringementDto, {
                amountDue: '500.00',
                brn: null,
                caseNumber: null,
                city: 'ירושלים',
                country: 'ישראל',
                dateRedirectionCompleted: null,
                isExternal: true,
                issuer: issuer.code,
                issuerStatus: NominationStatus.Acknowledged,
                issuerStatusDescription: null,
                latestPaymentDate: moment().add(3, 'months').toISOString(),
                noticeNumber: 'noticenumber14325',
                offenceDate,
                paymentDate: null,
                rawAddress: 'הורקניה',
                reason: 'צומת',
                reasonCode: null,
                redirectionIdentifier: '1234',
                redirectionLetterSendDate: null,
                setRedirectionIdentifier: true,
                redirectionType: 'External',
                streetName: 'הורקניה',
                timezone: 'Asia/Jerusalem',
            });
            const updatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, updateDto, {
                redirectionIdentifier: '1234',
                setRedirectionIdentifier: true,
            });

            expect(updatedInfringement.nomination.status).toBe(NominationStatus.Acknowledged);
            expect(updatedInfringement.nomination.rawRedirectionIdentifier).toBe('1234');
        }),
    );

    it(
        `Does not change the status if it is in redirection process`,
        runInTransaction(async () => {
            const vehicle = await generator.vehicle();
            const owner = await generator.account();
            const ownershipContract = await generator.ownershipContract({
                vehicle,
                owner,
                endDate: moment().add(3, 'years').toISOString(),
                startDate: moment().subtract(3, 'years').toISOString(),
            });
            const user = await generator.account();
            const leaseContract = await generator.leaseContract({
                user,
                owner,
                vehicle,
                endDate: moment().add(3, 'years').toISOString(),
                startDate: moment().subtract(3, 'years').toISOString(),
            });
            const issuer = await generator.issuer();
            const offenceDate = moment().toISOString();
            const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                noticeNumber: 'noticenumber14325',
                issuer: issuer.name,
                vehicle: vehicle.registration,
                amountDue: '500.00',
                originalAmount: '500.00',
                offenceDate,
                streetName: faker.address.streetName(),
                streetNumber: `${faker.random.number(400)}`,
                country: 'South Africa',
                brn: owner.identifier,
                issuerStatus: NominationStatus.InRedirectionProcess,
            });

            const infringement = await createInfringementService.createInfringement(infringementData);
            expect(infringement.infringementId).toBeTruthy();
            expect(infringement.nomination.nominationId).toBeTruthy();
            expect(infringement.nomination.status).toBe(NominationStatus.InRedirectionProcess);

            const updateDto = plainToClass(UpdateInfringementDto, {
                amountDue: '500.00',
                brn: null,
                caseNumber: null,
                city: 'ירושלים',
                country: 'ישראל',
                dateRedirectionCompleted: null,
                isExternal: true,
                issuer: issuer.code,
                issuerStatus: 'פתוח',
                issuerStatusDescription: null,
                latestPaymentDate: moment().add(3, 'months').toISOString(),
                noticeNumber: 'noticenumber14325',
                offenceDate,
                paymentDate: null,
                rawAddress: 'הורקניה',
                reason: 'צומת',
                reasonCode: null,
                redirectionIdentifier: null,
                redirectionLetterSendDate: null,
                redirectionType: 'External',
                streetName: 'הורקניה',
                timezone: 'Asia/Jerusalem',
            });
            const updatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, updateDto);

            expect(updatedInfringement.nomination.status).toBe(NominationStatus.InRedirectionProcess);
        }),
    );

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
