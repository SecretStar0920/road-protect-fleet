import { INestApplication } from '@nestjs/common';
import { runInTransaction } from 'typeorm-test-transactions';
import { TestApp } from '../helpers/test-app.singleton';
import { InfringementReportingByAccountRelationService } from '@modules/infringement/services/infringement-reporting-by-account-relation.service';
import { InfringementStatus, NominationStatus } from '@entities';
import { generator } from '@modules/shared/helpers/data-generators';
import { AccountRelationInfringementReportDto } from '@modules/infringement/controllers/infringement-report.dto';
import * as moment from 'moment';
import { Config } from '@config/config';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { UpdateInfringementService } from '@modules/infringement/services/update-infringement.service';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { waitForDebugger } from '../helpers/wait-for-debugger';

jest.setTimeout(50000);

async function setupDBForTest() {
    // setup db for testing
    const forwardAccount = await generator.account();
    const reverseAccount = await generator.account();
    const vehicle = await generator.vehicle();
    const leaseContract = await generator.leaseContract({ user: forwardAccount, owner: reverseAccount, vehicle });
    const accountRelation = await generator.accountRelation({ forward: forwardAccount, reverse: reverseAccount });
    const issuer = await generator.issuer();

    return { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer };
}

describe('Infringement Reporting By Account Relation Service', () => {
    let app: INestApplication;
    let infringementReportingByAccountRelationService: InfringementReportingByAccountRelationService;
    let createInfringementService: CreateInfringementService;
    let updateInfringementService: UpdateInfringementService;

    beforeAll(async () => {
        app = await TestApp.app();
        infringementReportingByAccountRelationService = app.get(InfringementReportingByAccountRelationService);
        createInfringementService = app.get(CreateInfringementService);
        updateInfringementService = app.get(UpdateInfringementService);
    });

    describe('Infringement Reporting By Account Relation Service', () => {
        it(
            'Should report on open infringement',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                expect(leaseContract.user.accountId).toEqual(forwardAccount.accountId);
                expect(leaseContract.owner.accountId).toEqual(reverseAccount.accountId);

                // Basic case: One open infringement on vehicle with contract
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
                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: moment().subtract(1, 'day').toISOString(),
                    setRedirectionIdentifier: true,
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement = await createInfringementService.createInfringement(createDto, createNominationDto);

                expect(infringement.status).toEqual(InfringementStatus.Due);
                expect(infringement.brn).toEqual(reverseAccount.identifier);
                expect(infringement.contract.contractId).toEqual(leaseContract.contractId);
                expect(infringement.nomination.rawRedirectionIdentifier).toEqual(forwardAccount.identifier);
                expect(infringement.nomination.account.accountId).toEqual(forwardAccount.accountId);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(), // for delta reports, not currently applicable
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                // // Emails aren't sending in testing thus email sent and success are false
                // expect(result.emailSent).toEqual(false);
                // expect(result.success).toEqual(false);

                // Check the correct infringement is reported
                expect(result.data.openInfringements).toBeTruthy();
                // expect(result.data.openInfringements.length).toEqual(1);
                expect(result.data.openInfringements[0].infringementId).toEqual(infringement.infringementId);
                // Check summary  values
                expect(result.data.summarySheet).toBeTruthy();
                const expectedSummarySheet: { Property: string; Value: any }[] = [
                    { Property: 'סה"כ דוחות לתשלום', Value: 1 }, // number of open infringements
                    { Property: 'כמות קנסות בסכום המקורי', Value: 0 }, // open infringements at original amount
                    // { Property: 'כמות קנסות עם פיגורים', Value: 1 }, // open infringements with penalties
                    { Property: 'כמות רכבים עם קנסות', Value: 1 }, // number of vehicles with infringements
                    { Property: 'כמות רשויות שנתנו קנסות', Value: 1 }, // number of issuers data collected from
                    // { Property: 'כמות רכבים בלי טפסי הסבה', Value: 1 }, // number of issuers vehicles with infringements that are missing documents
                    // { Property: 'סה"כ בסכום המקורי', Value: '₪0' }, // total amount due at original amount
                    // { Property: 'סה"כ קנסות עם פיגורים', Value: '₪800' }, // total amount due with penalties
                    { Property: 'סה"כ סכום מקורי לתשלום', Value: '₪500.00' }, // total original amount
                    { Property: 'סה"כ יתרה לתשלום', Value: '₪800.00' }, // total amount due
                    // { Property: 'סה"כ לתשלום תוך 30 יום', Value: '₪0' }, // total amount due in the next 30 days
                    // { Property: 'סה"כ ריבית פיגורים', Value: '₪300' },
                ];
                expect(result.data.summarySheet).toEqual(expect.arrayContaining(expectedSummarySheet));

                //     Check date format
                const dateFormatReg = /^\d{2}([/])\d{2}\1\d{4}\s\d{2}([:])\d{2}\2\d{2}$/;
                const resultDate: string = result.data.summarySheet[0].Value;
                expect(dateFormatReg.test(resultDate)).toEqual(true);
            }),
        );

        it(
            'Should not report on open infringement that does not belong to reverse account',
            runInTransaction(async () => {
                await FeatureFlagHelper.createTestFeature('automated-digital-nominations');

                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                // Basic case: One open infringement on vehicle with contract
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
                    brn: forwardAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement = await createInfringementService.createInfringement(createDto);

                expect(infringement.status).toEqual(InfringementStatus.Due);
                expect(infringement.nomination.account.accountId).toEqual(leaseContract.user.accountId);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(), // for delta reports, not currently applicable
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report with no infringements',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(), // for delta reports, not currently applicable
                };
                // No infringements
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report on infringement on vehicle without contract',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const vehicleNoContract = await generator.vehicle();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicleNoContract.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement = await createInfringementService.createInfringement(createDto, createNominationDto);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };

                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report on infringement on vehicle without contract that is nominated to the receiver',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const vehicleNoContract = await generator.vehicle();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicleNoContract.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement = await createInfringementService.createInfringement(createDto, createNominationDto);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };

                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report on infringement that is Paid',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    // issuerStatus: 'שולם', // To set Infringement status to paid
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                let infringement = await createInfringementService.createInfringement(createDto, createNominationDto);
                expect(infringement.status).toEqual(InfringementStatus.Due);

                const updateInfringementDto: UpdateInfringementDto = plainToClass(UpdateInfringementDto, {
                    infringementStatus: InfringementStatus.Paid,
                    nominationStatus: NominationStatus.Closed,
                });

                infringement = await updateInfringementService.updateInfringement(
                    infringement.infringementId,
                    updateInfringementDto,
                    {},
                    true,
                );

                expect(infringement.status).toEqual(InfringementStatus.Paid);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report on infringement that is Closed',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    // issuerStatus: 'סגור', // To set Infringement status to closed
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                let infringement = await createInfringementService.createInfringement(createDto, createNominationDto);

                const updateInfringementDto: UpdateInfringementDto = plainToClass(UpdateInfringementDto, {
                    infringementStatus: InfringementStatus.Closed,
                    nominationStatus: NominationStatus.Closed,
                });

                infringement = await updateInfringementService.updateInfringement(
                    infringement.infringementId,
                    updateInfringementDto,
                    {},
                    true,
                );

                expect(infringement.status).toEqual(InfringementStatus.Closed);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report on infringement that is on vehicle with contract with a different forward account',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const receivingAccount = await generator.account();
                const secondAccountRelation = await generator.accountRelation({ forward: receivingAccount, reverse: reverseAccount });
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration, // vehicle has contract with forwardAccount and reverseAccount
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement = await createInfringementService.createInfringement(createDto, createNominationDto);

                expect(infringement.status).toEqual(InfringementStatus.Due);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: secondAccountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report on infringement that is on vehicle with contract with a different reverse account',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const sendingAccount = await generator.account();
                const secondAccountRelation = await generator.accountRelation({ forward: forwardAccount, reverse: sendingAccount });
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration, // vehicle has contract with forwardAccount and reverseAccount
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement = await createInfringementService.createInfringement(createDto, createNominationDto);

                expect(infringement.status).toEqual(InfringementStatus.Due);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: secondAccountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report on infringement on vehicle with contract if the infringement offence date is outside the contract period',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().add('-10', 'days').toISOString(), // outside of contract dates
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    isExternal: true, // to set the external change date to be included in the report
                });

                const infringement = await createInfringementService.createInfringement(createDto);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };

                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should not report on infringement on vehicle with contract that is not nominated to the receiver',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
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
                    brn: faker.random.alphaNumeric(6), // nominate to random identifier
                    isExternal: true, // to set the external change date to be included in the report
                });

                const infringement = await createInfringementService.createInfringement(createDto);

                expect(infringement.status).toEqual(InfringementStatus.Due);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                expect(result.emailSent).toEqual(false);
                expect(result.success).toEqual(true);
                expect(result.data).toBeNull();
            }),
        );

        it(
            'Should report on multiple infringements on a single vehicle with a contract that is nominated to the receiver',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                // First Infringement
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

                    isExternal: true, // to set the external change date to be included in the report
                    brn: reverseAccount.identifier,
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement1 = await createInfringementService.createInfringement(createDto, createNominationDto);
                expect(infringement1.status).toEqual(InfringementStatus.Due);

                // Second Infringement
                const createDto2: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '500',
                    originalAmount: '500.00',
                    latestPaymentDate: moment().add(`10`, 'day').toISOString(),
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',

                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto2: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement2 = await createInfringementService.createInfringement(createDto2, createNominationDto2);
                expect(infringement2.status).toEqual(InfringementStatus.Due);

                // Third Infringement to be paid and not included in the report
                const createDto3: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    // issuerStatus: 'שולם', // To set Infringement status to paid
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    isExternal: true, // to set the external change date to be included in the report

                    brn: reverseAccount.identifier,
                });

                const createNominationDto3: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                let infringement3 = await createInfringementService.createInfringement(createDto3, createNominationDto3);

                const updateInfringementDto3: UpdateInfringementDto = plainToClass(UpdateInfringementDto, {
                    infringementStatus: InfringementStatus.Paid,
                    nominationStatus: NominationStatus.Closed,
                });

                infringement3 = await updateInfringementService.updateInfringement(
                    infringement3.infringementId,
                    updateInfringementDto3,
                    {},
                    true,
                );

                expect(infringement3.status).toEqual(InfringementStatus.Paid);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                // expect(result.emailSent).toEqual(false);
                // expect(result.success).toEqual(false);
                // Check the correct infringement is reported
                expect(result.data.openInfringements).toBeTruthy();
                // expect(result.data.openInfringements.length).toEqual(2);
                const reportedInfringementIds = result.data.openInfringements.map((infringement) => infringement.infringementId);
                expect(reportedInfringementIds).toEqual(
                    expect.arrayContaining([infringement1.infringementId, infringement2.infringementId]),
                );
                expect(reportedInfringementIds).not.toEqual(expect.arrayContaining([infringement3.infringementId]));
                // Check summary  values
                expect(result.data.summarySheet).toBeTruthy();
                const expectedSummarySheet: { Property: string; Value: any }[] = [
                    { Property: 'סה"כ דוחות לתשלום', Value: 2 }, // number of open infringements
                    { Property: 'כמות קנסות בסכום המקורי', Value: 1 }, // open infringements at original amount
                    { Property: 'כמות קנסות עם פיגורים', Value: 1 }, // open infringements with penalties
                    { Property: 'כמות רכבים עם קנסות', Value: 1 }, // number of vehicles with infringements
                    { Property: 'כמות רשויות שנתנו קנסות', Value: 1 }, // number of issuers data collected from
                    // { Property: 'כמות רכבים בלי טפסי הסבה', Value: 1 }, // number of vehicles with infringements that are missing documents
                    // { Property: 'סה"כ בסכום המקורי', Value: '₪500' }, // total amount due at original amount
                    // { Property: 'סה"כ קנסות עם פיגורים', Value: '₪800' }, // total amount due with penalties
                    { Property: 'סה"כ סכום מקורי לתשלום', Value: '₪1,000.00' }, // total original amount
                    { Property: 'סה"כ יתרה לתשלום', Value: '₪1,300.00' }, // total amount due
                    // { Property: 'סה"כ לתשלום תוך 30 יום', Value: '₪500' }, // total amount due in the next 30 days
                    // { Property: 'סה"כ ריבית פיגורים', Value: '₪300' }, // total penalty amount
                ];
                expect(result.data.summarySheet).toEqual(expect.arrayContaining(expectedSummarySheet));

                //     Check date format
                const dateFormatReg = /^\d{2}([/])\d{2}\1\d{4}\s\d{2}([:])\d{2}\2\d{2}$/;
                const resultDate: string = result.data.summarySheet[0].Value;
                expect(dateFormatReg.test(resultDate)).toEqual(true);
            }),
        );

        it(
            'Should report on multiple infringements on multiple vehicles with multiple issuers',
            runInTransaction(async () => {
                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                // First Infringement
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
                    isExternal: true, // to set the external change date to be included in the report

                    brn: reverseAccount.identifier,
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement = await createInfringementService.createInfringement(createDto, createNominationDto);
                expect(infringement.status).toEqual(InfringementStatus.Due);

                // Second Infringement
                const vehicle2 = await generator.vehicle();
                const issuer2 = await generator.issuer();
                const leaseContract2 = await generator.leaseContract({ owner: forwardAccount, user: reverseAccount, vehicle: vehicle2 });
                const createDto2: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer2.name,
                    vehicle: vehicle2.registration,
                    amountDue: '400',
                    originalAmount: '400',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    isExternal: true, // to set the external change date to be included in the report

                    brn: reverseAccount.identifier,
                });

                const createNominationDto2: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement2 = await createInfringementService.createInfringement(createDto2, createNominationDto2);
                expect(infringement2.status).toEqual(InfringementStatus.Due);

                // Third Infringement
                const vehicle3 = await generator.vehicle();
                const leaseContract3 = await generator.leaseContract({ owner: forwardAccount, user: forwardAccount, vehicle: vehicle3 });
                const createDto3: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle3.registration,
                    amountDue: '800',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',

                    isExternal: true, // to set the external change date to be included in the report
                    brn: reverseAccount.identifier,
                });

                const createNominationDto3: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement3 = await createInfringementService.createInfringement(createDto3, createNominationDto3);
                expect(infringement3.status).toEqual(InfringementStatus.Due);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                // Emails aren't sending in testing thus email sent and success are false
                // expect(result.emailSent).toEqual(false);
                // expect(result.success).toEqual(false);
                // Check the correct infringement is reported
                expect(result.data.openInfringements).toBeTruthy();
                // expect(result.data.openInfringements.length).toEqual(2);
                const reportedInfringementIds = result.data.openInfringements.map((inf) => inf.infringementId);
                expect(reportedInfringementIds).toEqual(
                    expect.arrayContaining([infringement.infringementId, infringement2.infringementId]),
                );
                // Check summary  values
                expect(result.data.summarySheet).toBeTruthy();
                const expectedSummarySheet: { Property: string; Value: any }[] = [
                    { Property: 'סה"כ דוחות לתשלום', Value: 2 }, // number of open infringements
                    { Property: 'כמות קנסות בסכום המקורי', Value: 1 }, // open infringements at original amount
                    { Property: 'כמות קנסות עם פיגורים', Value: 1 }, // open infringements with penalties
                    { Property: 'כמות רכבים עם קנסות', Value: 2 }, // number of vehicles with infringements
                    { Property: 'כמות רשויות שנתנו קנסות', Value: 2 }, // number of issuers data collected from
                    // { Property: 'כמות רכבים בלי טפסי הסבה', Value: 2 }, // number of vehicles with infringements that are missing documents
                    // { Property: 'סה"כ בסכום המקורי', Value: '₪400' }, // total amount due at original amount
                    // { Property: 'סה"כ קנסות עם פיגורים', Value: '₪800' }, // total amount due with penalties
                    { Property: 'סה"כ סכום מקורי לתשלום', Value: '₪900.00' }, // total original amount
                    { Property: 'סה"כ יתרה לתשלום', Value: '₪1,200.00' }, // total amount due
                    // { Property: 'סה"כ לתשלום תוך 30 יום', Value: '₪0' }, // total amount due in the next 30 days
                    // { Property: 'סה"כ ריבית פיגורים', Value: '₪300' },
                ];
                expect(result.data.summarySheet).toEqual(expect.arrayContaining(expectedSummarySheet));

                //     Check date format
                const dateFormatReg = /^\d{2}([/])\d{2}\1\d{4}\s\d{2}([:])\d{2}\2\d{2}$/;
                const resultDate: string = result.data.summarySheet[0].Value;
                expect(dateFormatReg.test(resultDate)).toEqual(true);
            }),
        );

        it(
            'Should report on correct infringements when vehicle has multiple contracts',
            runInTransaction(async () => {
                await FeatureFlagHelper.createTestFeature('automated-digital-nominations');

                const { forwardAccount, reverseAccount, vehicle, leaseContract, accountRelation, issuer } = await setupDBForTest();
                const leaseContractForward = await generator.leaseContract({
                    user: forwardAccount,
                    vehicle,
                    startDate: moment().subtract(10, 'days').toISOString(),
                    endDate: moment().subtract(8, 'days').toISOString(),
                });
                const leaseContractReverse = await generator.leaseContract({
                    owner: reverseAccount,
                    vehicle,
                    startDate: moment().subtract(13, 'days').toISOString(),
                    endDate: moment().subtract(11, 'days').toISOString(),
                });
                const leaseContractSwapped = await generator.leaseContract({
                    owner: forwardAccount,
                    user: reverseAccount,
                    vehicle,
                    startDate: moment().subtract(16, 'days').toISOString(),
                    endDate: moment().subtract(14, 'days').toISOString(),
                });

                const createDto: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '500',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(), // when leaseContract is valid
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    isExternal: true, // to set the external change date to be included in the report

                    brn: reverseAccount.identifier,
                });

                const createNominationDto: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement = await createInfringementService.createInfringement(createDto, createNominationDto);

                const createDto2: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '200',
                    originalAmount: '100',
                    offenceDate: moment().subtract(9, 'days').toISOString(), // when leaseContractForward is valid
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',

                    isExternal: true, // to set the external change date to be included in the report
                    brn: reverseAccount.identifier,
                });

                const createNominationDto2: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement2 = await createInfringementService.createInfringement(createDto2, createNominationDto2);

                const createDto3: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '400',
                    originalAmount: '200',
                    offenceDate: moment().subtract(12, 'days').toISOString(), // when leaseContractReverse is valid
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',

                    isExternal: true, // to set the external change date to be included in the report
                    brn: reverseAccount.identifier,
                });

                const createNominationDto3: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement3 = await createInfringementService.createInfringement(createDto3, createNominationDto3);

                const createDto4: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '600',
                    originalAmount: '300',
                    offenceDate: moment().subtract(15, 'days').toISOString(), // when leaseContractSwapped is valid
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: reverseAccount.identifier,
                    isExternal: true, // to set the external change date to be included in the report
                });

                const createNominationDto4: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement4 = await createInfringementService.createInfringement(createDto4, createNominationDto4);

                const createDto5: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: faker.random.alphaNumeric(10),
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '500',
                    originalAmount: '400',
                    offenceDate: moment().subtract(20, 'days').toISOString(), // when no contract is valid
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',

                    isExternal: true, // to set the external change date to be included in the report
                    issuerStatus: 'פעיל',
                    brn: reverseAccount.identifier,
                });

                const createNominationDto5: NominationDto = plainToClass(NominationDto, {
                    redirectionIdentifier: forwardAccount.identifier,
                    redirectionLetterSendDate: faker.date.recent(),
                });

                // Use create infringement service so that entities are linked in database correctly
                const infringement5 = await createInfringementService.createInfringement(createDto5, createNominationDto5);

                const accountRelationInfringementReportDto: AccountRelationInfringementReportDto = {
                    accountRelationId: accountRelation.accountRelationId,
                    queryDate: moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString(),
                };
                const result = await infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(
                    accountRelationInfringementReportDto,
                );

                expect(result).toBeTruthy();
                // expect(result.emailSent).toEqual(false);
                // expect(result.success).toEqual(false);
                // Check the correct infringement is reported
                expect(result.data.openInfringements).toBeTruthy();
                // expect(result.data.openInfringements.length).toEqual(2);
                const reportedInfringementIds = result.data.openInfringements.map((infringement) => infringement.infringementId);
                expect(reportedInfringementIds).toEqual(
                    expect.arrayContaining([infringement.infringementId, infringement4.infringementId]),
                );
                // Check summary  values
                expect(result.data.summarySheet).toBeTruthy();
                const expectedSummarySheet: { Property: string; Value: any }[] = [
                    { Property: 'סה"כ דוחות לתשלום', Value: 2 }, // number of open infringements
                    { Property: 'כמות קנסות בסכום המקורי', Value: 1 }, // open infringements at original amount
                    { Property: 'כמות קנסות עם פיגורים', Value: 1 }, // open infringements with penalties
                    { Property: 'כמות רכבים עם קנסות', Value: 1 }, // number of vehicles with infringements
                    { Property: 'כמות רשויות שנתנו קנסות', Value: 1 }, // number of issuers data collected from
                    // { Property: 'כמות רכבים בלי טפסי הסבה', Value: 1 }, // number of vehicles with infringements that are missing documents
                    // { Property: 'סה"כ בסכום המקורי', Value: '₪500' }, // total amount due at original amount
                    // { Property: 'סה"כ קנסות עם פיגורים', Value: '₪600' }, // total amount due with penalties
                    { Property: 'סה"כ סכום מקורי לתשלום', Value: '₪800' }, // total original amount
                    { Property: 'סה"כ יתרה לתשלום', Value: '₪1,100' }, // total amount due
                    // { Property: 'סה"כ לתשלום תוך 30 יום', Value: '₪0' }, // total amount due in the next 30 days
                    // { Property: 'סה"כ ריבית פיגורים', Value: '₪300' },
                ];
                expect(result.data.summarySheet).toEqual(expect.arrayContaining(expectedSummarySheet));

                //     Check date format
                const dateFormatReg = /^\d{2}([/])\d{2}\1\d{4}\s\d{2}([:])\d{2}\2\d{2}$/;
                const resultDate: string = result.data.summarySheet[0].Value;
                expect(dateFormatReg.test(resultDate)).toEqual(true);
            }),
        );
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
