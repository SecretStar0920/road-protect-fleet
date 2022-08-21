import { Infringement, InfringementStatus, NominationStatus } from '@entities';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { IssuerStatusMap } from '@modules/infringement/helpers/status-mapper/config/issuer-status-map';
import { StatusCombinations } from '@modules/infringement/helpers/status-mapper/config/status-combinations';
import { statusMapper } from '@modules/infringement/helpers/status-mapper/status-mapper';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { InfringementScheduleService } from '@modules/infringement/services/infringement-schedule.service';
import { UpdateInfringementService } from '@modules/infringement/services/update-infringement.service';
import { generator } from '@modules/shared/helpers/data-generators';
import { INestApplication } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import * as moment from 'moment';
import { runInTransaction } from 'typeorm-test-transactions';
import { TestApp } from '../helpers/test-app.singleton';

describe('Infringement Nomination Status Mapping', () => {
    let app: INestApplication;
    let createInfringementService: CreateInfringementService;
    let updateInfringementService: UpdateInfringementService;
    let schedulerService: InfringementScheduleService;

    beforeAll(async () => {
        app = await TestApp.app();
        createInfringementService = app.get(CreateInfringementService);
        updateInfringementService = app.get(UpdateInfringementService);
        schedulerService = app.get(InfringementScheduleService);
    });

    describe('Infringement Nomination Status Mapping', () => {
        it(
            'Should return expected status combinations for given issuer statuses',
            runInTransaction(async () => {
                const paidIssuerStatus = 'שולם'; // Paid
                const paidStatusCombination = IssuerStatusMap.get[paidIssuerStatus];
                expect(paidStatusCombination.nomination).toEqual(NominationStatus.Closed);
                expect(paidStatusCombination.infringement).toEqual(InfringementStatus.Paid);

                const issuerStatus = 'RAHSBDHABSD'; // Random (expect no return)
                const statusCombination = IssuerStatusMap.get[issuerStatus];
                expect(statusCombination).toBeUndefined();
            }),
        );

        it(
            'Should throw an error if an infringement status transition is invalid',
            runInTransaction(async () => {
                const caseA = statusMapper.isValidInfringementStatusTransition(InfringementStatus.Due, InfringementStatus.Paid);
                expect(caseA.isValid).toEqual(true);

                const caseB = statusMapper.isValidInfringementStatusTransition(InfringementStatus.Paid, InfringementStatus.Due);
                expect(caseB.isValid).toEqual(false);

                const caseC = statusMapper.isValidInfringementStatusTransition(InfringementStatus.Closed, InfringementStatus.Due);
                expect(caseC.isValid).toEqual(false);

                const caseD = statusMapper.isValidInfringementStatusTransition(InfringementStatus.Outstanding, InfringementStatus.Paid);
                expect(caseD.isValid).toEqual(true);
            }),
        );

        it(
            'Should throw an error if a nomination status transition is invalid',
            runInTransaction(async () => {
                const caseA = statusMapper.isValidNominationStatusTransition(NominationStatus.Pending, NominationStatus.Acknowledged);
                expect(caseA.isValid).toEqual(true);

                const caseB = statusMapper.isValidNominationStatusTransition(NominationStatus.Acknowledged, NominationStatus.Pending);
                expect(caseB.isValid).toEqual(true);

                const caseC = statusMapper.isValidNominationStatusTransition(NominationStatus.Closed, NominationStatus.Acknowledged);
                expect(caseC.isValid).toEqual(false);

                const caseD = statusMapper.isValidNominationStatusTransition(
                    NominationStatus.InRedirectionProcess,
                    NominationStatus.RedirectionCompleted,
                );
                expect(caseD.isValid).toEqual(true);

                const caseE = statusMapper.isValidNominationStatusTransition(NominationStatus.Acknowledged, NominationStatus.Closed);
                expect(caseE.isValid).toEqual(true);

                const caseF = statusMapper.isValidNominationStatusTransition(
                    NominationStatus.Closed,
                    NominationStatus.InRedirectionProcess,
                );
                expect(caseF.isValid).toEqual(false);
            }),
        );

        it(
            'Should provide expected status combinations for a given default infringement creation Dto',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '500',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                const statusCombination = await statusMapper.resolveStatusCombination(
                    infringementData,
                    StatusCombinations.get.defaultNew,
                    null,
                );
                expect(statusCombination).toEqual(StatusCombinations.get.defaultNew);
            }),
        );

        it(
            'Should provide expected status combinations for a given infringement creation Dto with an issuerStatus',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    issuerStatus: 'שולם',
                    vehicle: vehicle.registration,
                    amountDue: '500',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                const statusCombination = await statusMapper.resolveStatusCombination(
                    infringementData,
                    StatusCombinations.get.defaultNew,
                    null,
                );
                expect(statusCombination).toEqual(StatusCombinations.get.paidFully);
            }),
        );

        it(
            'Should provide expected status combinations for a given infringement creation Dto with a penalty amount',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    issuerStatus: 'אכיפה',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                const statusCombination = await statusMapper.resolveStatusCombination(
                    infringementData,
                    StatusCombinations.get.defaultNew,
                    null,
                );
                expect(statusCombination).toEqual(StatusCombinations.get.defaultNew);
            }),
        );

        it(
            'Should provide expected status combinations for a given infringement creation Dto with a penalty amount and issuerStatus',
            runInTransaction(async () => {
                // In this case, issuerStatus takes preference over data rules.

                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    issuerStatus: 'שולם',
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                const statusCombination = await statusMapper.resolveStatusCombination(
                    infringementData,
                    StatusCombinations.get.defaultNew,
                    null,
                );
                expect(statusCombination).toEqual(StatusCombinations.get.paidFully);
            }),
        );

        it(
            'Should create an infringement and nomination with an expected status combination',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const account = await generator.account();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    issuerStatus: 'שולם',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: account.identifier, // NOTE NOMINATION
                });

                const infringement = await createInfringementService.createInfringement(createDto);
                expect(infringement.infringementId).toBeTruthy();
                expect(infringement.status).toEqual(InfringementStatus.Paid);
                expect(infringement.nomination).not.toBeUndefined();
                expect(infringement.nomination.account.accountId).toEqual(account.accountId);
                expect(infringement.nomination.status).toEqual(NominationStatus.Closed);
            }),
        );

        it(
            'Should update an infringement and nomination with an expected status combination',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const account = await generator.account();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: account.identifier, // NOTE NOMINATION
                });

                let infringement = await createInfringementService.createInfringement(createDto);
                expect(infringement.infringementId).toBeTruthy();
                expect(infringement.status).toEqual(InfringementStatus.Due);
                expect(infringement.nomination).not.toBeUndefined();
                expect(infringement.nomination.account.accountId).toEqual(account.accountId);
                expect(infringement.nomination.status).toEqual(NominationStatus.Acknowledged);

                // Now we update via external issuer status and see if everything works
                const updateDto1: UpdateInfringementDto = {
                    issuerStatus: 'שולם',
                };

                infringement = await updateInfringementService.updateInfringement(infringement.infringementId, updateDto1);
                expect(infringement.status).toEqual(InfringementStatus.Paid);
                expect(infringement.nomination).not.toBeUndefined();
                expect(infringement.nomination.account.accountId).toEqual(account.accountId);
                expect(infringement.nomination.status).toEqual(NominationStatus.Closed);

                // Now we update via external issuer status and see if everything works when doing something on this previously paid infringement
                const updateDto2: UpdateInfringementDto = {
                    issuerStatus: 'פעיל',
                };

                let errorMessage: string;
                try {
                    await updateInfringementService.updateInfringement(infringement.infringementId, updateDto2);
                } catch (e) {
                    errorMessage = e.message;
                }
                expect(errorMessage).toEqual('Invalid infringement status update. Cannot go from Paid to Due.');
            }),
        );

        it(
            'Should update an infringement and nomination with an expected status combination when transitioning from outstanding to redirection in process',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const firstAccount = await generator.account();
                const secondAccount = await generator.account();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: firstAccount.identifier, // NOTE NOMINATION
                });

                let infringement = await createInfringementService.createInfringement(createDto);
                expect(infringement.infringementId).toBeTruthy();
                expect(infringement.status).toEqual(InfringementStatus.Due);
                expect(infringement.nomination).not.toBeUndefined();
                expect(infringement.nomination.account.accountId).toEqual(firstAccount.accountId);
                expect(infringement.nomination.status).toEqual(NominationStatus.Acknowledged);

                // Mark outstanding
                await schedulerService.updateInfringementStatus();
                infringement = await Infringement.findOne(infringement.infringementId);
                expect(infringement.status).toEqual(InfringementStatus.Outstanding);

                // Now we update via external issuer status and see if everything works
                const firstUpdate: UpdateInfringementDto = {
                    // issuerStatus: 'נשלח לחברת השכרה', //No longer In Process, now default new
                    issuerStatus: NominationStatus.InRedirectionProcess,
                };

                infringement = await updateInfringementService.updateInfringement(infringement.infringementId, firstUpdate);
                expect(infringement.status).toEqual(InfringementStatus.Outstanding);
                expect(infringement.nomination.status).toEqual(NominationStatus.InRedirectionProcess);

                // Then update the redirection and ALSO close the infringement
                const secondUpdate: UpdateInfringementDto = {
                    issuerStatus: 'ביטול', // Closed
                    brn: secondAccount.identifier, // Nomination Target
                };

                infringement = await updateInfringementService.updateInfringement(infringement.infringementId, secondUpdate);
                expect(infringement.status).toEqual(InfringementStatus.Closed);
                expect(infringement.nomination).not.toBeUndefined();
                // expect(infringement.nomination.account.accountId).toEqual(secondAccount.accountId);
                expect(infringement.nomination.status).toEqual(NominationStatus.Closed);
            }),
        );

        it(
            'Should preserve infringement and nomination statuses when no issuerStatus change has occurred on update',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const account = await generator.account();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    issuerStatus: 'אכיפה', // Default new
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: account.identifier, // NOTE NOMINATION
                });

                let infringement = await createInfringementService.createInfringement(createDto);

                expect(infringement.infringementId).toBeTruthy();
                expect(infringement.status).toEqual(InfringementStatus.Due);
                expect(infringement.nomination).not.toBeUndefined();
                expect(infringement.nomination.account.accountId).toEqual(account.accountId);
                expect(infringement.nomination.status).toEqual(NominationStatus.Acknowledged);

                // // Now change nomination status to inRedirectionProcess
                infringement.nomination.status = NominationStatus.InRedirectionProcess;
                infringement.nomination = await infringement.nomination.save();

                // Now we update and make sure it's not reverting to issuer status
                const firstUpdate: UpdateInfringementDto = {
                    country: 'YAS',
                };

                infringement = await updateInfringementService.updateInfringement(infringement.infringementId, firstUpdate);
                expect(infringement.status).toEqual(InfringementStatus.Due);
                expect(infringement.nomination).not.toBeUndefined();
                expect(infringement.nomination.account.accountId).toEqual(account.accountId);
                expect(infringement.nomination.status).toEqual(NominationStatus.InRedirectionProcess);

                // // Now we update with same issuer status and expect status to be preserved
                const secondUpdate: UpdateInfringementDto = {
                    issuerStatus: 'אכיפה', // SAME AS BEFORE, default new
                };

                const newlyUpdatedAgain = await updateInfringementService.updateInfringement(infringement.infringementId, secondUpdate);

                expect(newlyUpdatedAgain.status).toEqual(InfringementStatus.Due);
                expect(infringement.nomination.status).toEqual(NominationStatus.InRedirectionProcess);
            }),
        );
        //
        // it(
        //     'Should force an infringement status to Outstanding if there is a penalty amount',
        //     runInTransaction(async () => {}),
        // );
        //
        // it(
        //     'Should force an infringement status to Paid if the infringement amount is 0',
        //     runInTransaction(async () => {}),
        // );
    });
    afterAll(async () => {
        await TestApp.closeApp();
    });
});
