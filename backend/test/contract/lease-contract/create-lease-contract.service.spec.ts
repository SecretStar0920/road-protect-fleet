import { INestApplication } from '@nestjs/common';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import { TestApp } from '../../helpers/test-app.singleton';
import { runInTransaction } from 'typeorm-test-transactions';
import { CreateLeaseContractDto } from '@modules/contract/modules/lease-contract/controllers/lease-contract.controller';
import { plainToClass } from 'class-transformer';
import { generator } from '@modules/shared/helpers/data-generators';
import { AccountRole } from '@entities';
import * as faker from 'faker';
import * as moment from 'moment';

describe('Create Lease Contract Service', () => {
    let app: INestApplication;
    let createLeaseContractService: CreateLeaseContractService;

    beforeAll(async () => {
        app = await TestApp.app();
        createLeaseContractService = app.get(CreateLeaseContractService);
    });

    describe('Create Lease Contract Service', () => {
        it(
            'Should create lease contract for valid inputs',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account({ role: AccountRole.User });
                const owner = await generator.account({ role: AccountRole.Owner });
                const vehicle = await generator.vehicle();
                const document = await generator.document({ fileDirectory: './tests' });

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                    document: document.documentId,
                });

                const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);

                expect(leaseContract).toBeTruthy();
                expect(leaseContract.status).toEqual('Valid');
                expect(leaseContract.vehicle.registration).toEqual(vehicle.registration);
                expect(leaseContract.document.fileName).toEqual(document.fileName);
            }),
        );

        it(
            'Should not create lease contract for vehicle that doesnt exist',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account({ role: AccountRole.User });
                const owner = await generator.account({ role: AccountRole.Owner });

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: faker.random.alphaNumeric(8),
                });

                try {
                    const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toEqual(`Vehicle with the given registration does not exist, please create the vehicle first`);
                }
            }),
        );

        it(
            'Should not create lease contract for user that doesnt exist',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const owner = await generator.account({ role: AccountRole.Owner });
                const accountIdentifier = faker.random.alphaNumeric(6);
                const vehicle = await generator.vehicle();

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    user: accountIdentifier,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                });

                try {
                    const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toEqual(`Account with identifier ${accountIdentifier} not found`);
                }
            }),
        );

        it(
            'Should not create lease contract for null vehicle registration',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account({ role: AccountRole.User });
                const owner = await generator.account({ role: AccountRole.Owner });

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: null,
                });

                try {
                    const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toEqual('Vehicle with the given registration does not exist, please create the vehicle first');
                }
            }),
        );

        it(
            'Should not create lease contract when endDate is before startDate',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const endDate = moment().set({ year: 2013, month: 3 }).toISOString();
                const user = await generator.account({ role: AccountRole.User });
                const owner = await generator.account({ role: AccountRole.Owner });
                const vehicle = await generator.vehicle();

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    endDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                });

                try {
                    const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(e.message).toEqual('range lower bound must be less than or equal to range upper bound');
                }
            }),
        );

        it(
            'Lease contract status should be Expired when endDate is in the past',
            runInTransaction(async () => {
                const startDate = moment().set({ year: 2020, month: 1 }).toISOString();
                const endDate = moment().set({ year: 2020, month: 3 }).toISOString();
                const user = await generator.account({ role: AccountRole.User });
                const owner = await generator.account({ role: AccountRole.Owner });
                const vehicle = await generator.vehicle();

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    endDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                });

                const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);
                expect(leaseContract).toBeTruthy();
                expect(leaseContract.status).toEqual('Expired');
            }),
        );

        it(
            'Should not create lease contract when it overlaps with existing lease',
            runInTransaction(async () => {
                const startDate1 = moment().set({ year: 2020, month: 1 }).toISOString();
                const endDate1 = moment().set({ year: 2020, month: 3 }).toISOString();
                const user1 = await generator.account({ role: AccountRole.User });
                const owner1 = await generator.account({ role: AccountRole.Owner });
                const vehicle1 = await generator.vehicle();

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate: startDate1,
                    endDate: endDate1,
                    user: user1.identifier,
                    owner: owner1.identifier,
                    vehicle: vehicle1.registration,
                });

                const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);
                expect(leaseContract).toBeTruthy();

                const startDate2 = moment().set({ year: 2020, month: 2 }).toISOString();
                const endDate2 = moment().toISOString();
                const user2 = await generator.account({ role: AccountRole.User });
                const owner2 = await generator.account({ role: AccountRole.Owner });

                const leaseData2: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate: startDate2,
                    endDate: endDate2,
                    user: user2.identifier,
                    owner: owner2.identifier,
                    vehicle: vehicle1.registration,
                });

                try {
                    const leaseContract2 = await createLeaseContractService.createContractAndLinkInfringements(leaseData2);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toEqual('Provided contract dates overlap with existing lease contract(s)');
                }
            }),
        );

        it(
            'Should not create lease contract when it overlaps with existing lease- edge case',
            runInTransaction(async () => {
                const startDate1 = moment().set({ year: 2020, month: 1 }).toISOString();
                const endDate1 = moment().set({ year: 2020, month: 3, date: 1 }).toISOString();
                const user1 = await generator.account({ role: AccountRole.User });
                const owner1 = await generator.account({ role: AccountRole.Owner });
                const vehicle1 = await generator.vehicle();

                expect(user1).toBeTruthy();
                expect(owner1).toBeTruthy();
                expect(vehicle1).toBeTruthy();

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate: startDate1,
                    endDate: endDate1,
                    user: user1.identifier,
                    owner: owner1.identifier,
                    vehicle: vehicle1.registration,
                });

                const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);
                expect(leaseContract).toBeTruthy();

                const startDate2 = endDate1;
                const endDate2 = moment().toISOString();
                const user2 = await generator.account({ role: AccountRole.User });
                const owner2 = await generator.account({ role: AccountRole.Owner });

                expect(user2).toBeTruthy();
                expect(owner2).toBeTruthy();

                const leaseData2: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate: startDate2,
                    endDate: endDate2,
                    user: user2.identifier,
                    owner: owner2.identifier,
                    vehicle: vehicle1.registration,
                });

                try {
                    const leaseContract2 = await createLeaseContractService.createContractAndLinkInfringements(leaseData2);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toEqual('Provided contract dates overlap with existing lease contract(s)');
                }
            }),
        );

        it(
            'Should not create lease contract for invalid document',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account({ role: AccountRole.User });
                const owner = await generator.account({ role: AccountRole.Owner });
                const vehicle = await generator.vehicle();

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                    document: faker.random.number(3),
                });

                try {
                    const leaseContract = await createLeaseContractService.createContractAndLinkInfringements(leaseData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toEqual('Document not found');
                }
            }),
        );
    });

    describe('Update Lease Contract Service', () => {
        it(
            'Should update an existing contract with metadata if the lease contract already exists',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account({ role: AccountRole.User });
                const owner = await generator.account({ role: AccountRole.Owner });
                const vehicle = await generator.vehicle();
                const document = await generator.document({ fileDirectory: './tests' });

                const leaseData: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                    document: document.documentId,
                });

                const leaseContract = await createLeaseContractService.upsertContractAndLinkInfringements(leaseData);

                expect(leaseContract).toBeTruthy();
                expect(leaseContract.status).toEqual('Valid');
                expect(leaseContract.vehicle.registration).toEqual(vehicle.registration);
                expect(leaseContract.document.fileName).toEqual(document.fileName);

                const document1 = await generator.document({ fileDirectory: './tests' });
                const reference = 'test-reference';

                const leaseData1: CreateLeaseContractDto = plainToClass(CreateLeaseContractDto, {
                    startDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                    document: document1.documentId,
                    reference,
                });

                const leaseContract1 = await createLeaseContractService.upsertContractAndLinkInfringements(leaseData1);

                expect(leaseContract1).toBeTruthy();
                expect(leaseContract1.document.fileName).toEqual(document1.fileName);
                expect(leaseContract1.reference).toEqual(reference);
                expect(leaseContract1.contractId).toEqual(leaseContract.contractId);
            }),
        );
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
