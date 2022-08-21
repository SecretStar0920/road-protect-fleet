import { generator } from '@modules/shared/helpers/data-generators';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { INestApplication } from '@nestjs/common';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import BigNumber from 'bignumber.js';
import * as moment from 'moment';
import * as faker from 'faker';
import { plainToClass } from 'class-transformer';
import { AccountRole, Vehicle } from '@entities';
import { runInTransaction } from 'typeorm-test-transactions';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import { TestApp } from '../helpers/test-app.singleton';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';

describe('Create Infringement Service', () => {
    let app: INestApplication;
    let createInfringementService: CreateInfringementService;
    let createLeaseContractService: CreateLeaseContractService;

    beforeAll(async () => {
        app = await TestApp.app();
        createInfringementService = app.get(CreateInfringementService);
        createLeaseContractService = app.get(CreateLeaseContractService);
    });

    describe('Create Infringement Service', () => {
        it(
            'Should not create for an unknown issuer',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuerName = faker.address.city();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: 'noticenumber14325',
                    issuer: issuerName,
                    vehicle: vehicle.registration,
                    amountDue: `${faker.random.number(1000)}`,
                    originalAmount: `${faker.random.number(1000)}`,
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });
                // test

                try {
                    const infringement = await createInfringementService.createInfringement(infringementData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toBe(`Issuer ${issuerName} not found`);
                }
            }),
        );

        it(
            'Should create for a known issuer and unknown vehicle',
            runInTransaction(async () => {
                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: 'noticenumber14325',
                    issuer: issuer.name,
                    vehicle: 'REGISTRATION',
                    amountDue: '500',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                const infringement = await createInfringementService.createInfringement(infringementData);

                const vehicle = await Vehicle.findOneByRegistrationOrId('REGISTRATION');
                expect(infringement).toBeTruthy();
                expect(vehicle).toBeTruthy();
                expect(vehicle.registration).toEqual('REGISTRATION');
            }),
        );

        it(
            'Should create for a known issuer and known vehicle',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: 'noticenumber14325',
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: '500',
                    originalAmount: '500',
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                const infringement = await createInfringementService.createInfringement(infringementData);

                expect(infringement.infringementId).toBeTruthy();
            }),
        );

        it(
            'Should map incoming data into valid formats',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: '0001-01',
                    issuer: issuer.name,
                    vehicle: '# X $P -H_592GP',
                    amountDue: 500.11,
                    originalAmount: 0,
                    offenceDate: '2012-01-01',
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                const infringement = await createInfringementService.createInfringement(infringementData);

                expect(infringement).toBeTruthy();
                expect(infringement.noticeNumber).toEqual('101');
                expect(infringement.vehicle.registration).toEqual('XPH592GP');
                expect(infringement.amountDue).toEqual('500.11');
                expect(infringement.originalAmount).toEqual('500.11');
                expect(moment('2012-01-01').isSame(moment(infringement.offenceDate))).toBeTruthy();
            }),
        );

        it(
            'Should link to the correct contract and nominate by contract parties',
            runInTransaction(async () => {
                const vehicle = await generator.vehicle();
                const ownerAccount = await generator.account({ role: AccountRole.Owner });
                const userAccount = await generator.account({ role: AccountRole.User });
                const contractA = await createLeaseContractService.createContractAndLinkInfringements({
                    owner: ownerAccount.identifier,
                    user: userAccount.identifier,
                    vehicle: vehicle.registration,
                    startDate: moment().subtract(10, 'days').toISOString(),
                    endDate: moment().subtract(5, 'days').toISOString(),
                });
                const contractB = await createLeaseContractService.createContractAndLinkInfringements({
                    owner: ownerAccount.identifier,
                    user: userAccount.identifier,
                    vehicle: vehicle.registration,
                    startDate: moment().subtract(4, 'days').toISOString(),
                    endDate: moment().add(4, 'days').toISOString(),
                });
                const contractC = await createLeaseContractService.createContractAndLinkInfringements({
                    owner: ownerAccount.identifier,
                    user: userAccount.identifier,
                    vehicle: vehicle.registration,
                    startDate: moment().add(5, 'days').toISOString(),
                    endDate: moment().add(10, 'days').toISOString(),
                });

                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: 'noticenumber14325',
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: `${faker.random.number(1000)}`,
                    originalAmount: `${faker.random.number(1000)}`,
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                const infringement = await createInfringementService.createInfringement(infringementData);

                // Check linked to correct contract
                expect(infringement.contract.contractId).toEqual(contractB.contractId);
                // Check nominated to correct account
                expect(infringement.nomination).toBeTruthy();
                expect(infringement.nomination.account).toBeTruthy();
                expect(infringement.nomination.account.accountId).toEqual(ownerAccount.accountId);
                // Check linked to correct vehicle
                expect(infringement.vehicle.registration).toEqual(vehicle.registration);
            }),
        );

        it(
            'Should link to the correct contract and nominate by infringement brn',
            runInTransaction(async () => {
                await FeatureFlagHelper.createTestFeature('automated-digital-nominations');
                const vehicle = await generator.vehicle();
                const accountA = await generator.account({ role: AccountRole.Owner });
                const accountB = await generator.account({ role: AccountRole.User, identifier: 'specified-brn' });

                const contract = await createLeaseContractService.createContractAndLinkInfringements({
                    owner: accountA.identifier,
                    user: accountB.identifier,
                    vehicle: vehicle.registration,
                    startDate: moment().subtract(3, 'days').toISOString(),
                    endDate: moment().add(3, 'days').toISOString(),
                });

                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: 'noticenumber14325',
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: `${faker.random.number(1000)}`,
                    originalAmount: `${faker.random.number(1000)}`,
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                    brn: 'specified-brn',
                });

                const infringement = await createInfringementService.createInfringement(infringementData);

                // Check linked to correct contract
                expect(infringement.contract.contractId).toEqual(contract.contractId);
                // Check nominated to correct account
                expect(infringement.nomination).toBeTruthy();
                expect(infringement.nomination.account).toBeTruthy();
                expect(infringement.nomination.account.accountId).toEqual(accountB.accountId);
                // Check linked to correct vehicle
                expect(infringement.vehicle.registration).toEqual(vehicle.registration);
            }),
        );

        it(
            'Should not create a nomination if infringement.brn does not match any contract BRN, but should set a status',
            runInTransaction(async () => {
                await FeatureFlagHelper.createTestFeature('automated-digital-nominations');
                const vehicle = await generator.vehicle();
                const accountA = await generator.account({ role: AccountRole.Owner });
                const accountB = await generator.account({ role: AccountRole.User, identifier: 'specified-brn' });

                const contract = await createLeaseContractService.createContractAndLinkInfringements({
                    owner: accountA.identifier,
                    user: accountB.identifier,
                    vehicle: vehicle.registration,
                    startDate: moment().subtract(3, 'days').toISOString(),
                    endDate: moment().add(3, 'days').toISOString(),
                });

                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: 'noticenumber14325',
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: `${faker.random.number(1000) + 1}`,
                    originalAmount: `${faker.random.number(1000) + 1}`,
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400) + 1}`,
                    country: 'South Africa',
                    brn: 'unspecified-brn',
                });

                const infringement = await createInfringementService.createInfringement(infringementData);

                // Check linked to correct contract
                expect(infringement.contract.contractId).toEqual(contract.contractId);
                // Check nominated to no account
                expect(infringement.nomination.account.accountId).toEqual(accountB.accountId);
                // Check linked to correct vehicle
                expect(infringement.vehicle.registration).toEqual(vehicle.registration);
            }),
        );

        describe('Update total amount hook', () => {
            it(
                'Should set total amount to amount due if amount due is equal to original amount',
                runInTransaction(async () => {
                    const amountDue = '500';
                    const originalAmount = amountDue;
                    const vehicle = await generator.vehicle();
                    const issuer = await generator.issuer();
                    const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                        noticeNumber: 'noticenumber14325',
                        issuer: issuer.name,
                        vehicle: vehicle.registration,
                        amountDue,
                        originalAmount,
                        offenceDate: moment().toISOString(),
                        streetName: faker.address.streetName(),
                        streetNumber: `${faker.random.number(400)}`,
                        country: 'South Africa',
                    });

                    const infringement = await createInfringementService.createInfringement(infringementData);
                    expect(new BigNumber(infringement.totalAmount).isEqualTo(amountDue)).toBeTruthy();
                }),
            );

            it(
                'Should set total amount to amount due if amount due is greater than original amount',
                runInTransaction(async () => {
                    const amountDue = '800';
                    const originalAmount = '500';
                    const vehicle = await generator.vehicle();
                    const issuer = await generator.issuer();
                    const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                        noticeNumber: 'noticenumber14325',
                        issuer: issuer.name,
                        vehicle: vehicle.registration,
                        amountDue,
                        originalAmount,
                        offenceDate: moment().toISOString(),
                        streetName: faker.address.streetName(),
                        streetNumber: `${faker.random.number(400)}`,
                        country: 'South Africa',
                    });

                    const infringement = await createInfringementService.createInfringement(infringementData);
                    expect(new BigNumber(infringement.totalAmount).isEqualTo(amountDue)).toBeTruthy();
                }),
            );

            it(
                'Should set total amount to original amount if original amount is greater than amount due',
                runInTransaction(async () => {
                    const amountDue = '500';
                    const originalAmount = '800';
                    const vehicle = await generator.vehicle();
                    const issuer = await generator.issuer();
                    const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                        noticeNumber: 'noticenumber14325',
                        issuer: issuer.name,
                        vehicle: vehicle.registration,
                        amountDue,
                        originalAmount,
                        offenceDate: moment().toISOString(),
                        streetName: faker.address.streetName(),
                        streetNumber: `${faker.random.number(400)}`,
                        country: 'South Africa',
                    });

                    const infringement = await createInfringementService.createInfringement(infringementData);
                    expect(new BigNumber(infringement.totalAmount).isEqualTo(originalAmount)).toBeTruthy();
                }),
            );
        });
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
