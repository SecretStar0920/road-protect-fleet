import { INestApplication } from '@nestjs/common';
import { UpdateInfringementService } from '@modules/infringement/services/update-infringement.service';
import { BigNumber } from 'bignumber.js';
import { runInTransaction } from 'typeorm-test-transactions';
import { generator } from '@modules/shared/helpers/data-generators';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import * as moment from 'moment';
import { AccountRole, Infringement } from '@entities';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import { TestApp } from '../helpers/test-app.singleton';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';

describe('Update Infringement Service', () => {
    let app: INestApplication;
    let createInfringementService: CreateInfringementService;
    let createLeaseContractService: CreateLeaseContractService;
    let updateInfringementService: UpdateInfringementService;

    beforeAll(async () => {
        app = await TestApp.app();
        createInfringementService = app.get(CreateInfringementService);
        createLeaseContractService = app.get(CreateLeaseContractService);
        updateInfringementService = app.get(UpdateInfringementService);
    });

    describe('Update Infringement Service', () => {
        it(
            'Should map incoming data into valid formats',
            runInTransaction(async () => {
                await FeatureFlagHelper.createTestFeature('automated-digital-nominations');

                const vehicle = await generator.vehicle();
                const ownerAccount = await generator.account({ role: AccountRole.Owner });
                const userAccount = await generator.account({ role: AccountRole.User });
                const hybridAccount = await generator.account({ role: AccountRole.Hybrid });
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
                    startDate: moment().subtract(3, 'days').toISOString(),
                    endDate: moment().add(3, 'days').toISOString(),
                });
                // Contract user change
                const contractC = await createLeaseContractService.createContractAndLinkInfringements({
                    owner: ownerAccount.identifier,
                    user: hybridAccount.identifier,
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

                let infringement = await createInfringementService.createInfringement(infringementData);

                // Check linked to correct contract
                expect(infringement.contract.contractId).toEqual(contractB.contractId);
                // Check nominated to correct account
                expect(infringement.nomination).toBeTruthy();
                expect(infringement.nomination.account).toBeTruthy();
                // We'll nominate via lease contract here
                expect(infringement.nomination.account.accountId).toEqual(userAccount.accountId);
                // Check linked to correct vehicle
                expect(infringement.vehicle.registration).toEqual(vehicle.registration);

                // Now we update and check that the contract changes, as well as the nomination
                infringement = await updateInfringementService.updateInfringement(infringement.infringementId, {
                    offenceDate: moment().add(7, 'days').toISOString(),
                });

                // Check linked to correct contract
                expect(infringement.contract.contractId).toEqual(contractC.contractId);
                // Check nominated to correct account
                expect(infringement.nomination).toBeTruthy();
                expect(infringement.nomination.account).toBeTruthy();
                expect(infringement.nomination.account.accountId).toEqual(hybridAccount.accountId);
                // Check linked to correct vehicle
                expect(infringement.vehicle.registration).toEqual(vehicle.registration);
            }),
        );

        describe('Update total amount hook', () => {
            let infringement: Infringement;
            const originalTotalAmount = '500';
            beforeEach(async () => {
                const vehicle = await generator.vehicle();
                const issuer = await generator.issuer();
                const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
                    noticeNumber: 'noticenumber14325',
                    issuer: issuer.name,
                    vehicle: vehicle.registration,
                    amountDue: originalTotalAmount,
                    originalAmount: originalTotalAmount,
                    offenceDate: moment().toISOString(),
                    streetName: faker.address.streetName(),
                    streetNumber: `${faker.random.number(400)}`,
                    country: 'South Africa',
                });

                infringement = await createInfringementService.createInfringement(infringementData);
            });

            afterEach(async () => {
                await infringement.remove();
            });

            it(
                'Should set total amount to amount due if amount due is greater than the current total amount and greater than the original amount',
                runInTransaction(async () => {
                    const amountDue = '800';
                    const updatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, {
                        amountDue,
                    });

                    expect(new BigNumber(infringement.totalAmount).isLessThan(amountDue)).toBeTruthy();
                    expect(new BigNumber(updatedInfringement.totalAmount).isEqualTo(amountDue)).toBeTruthy();
                }),
            );

            it(
                'Should not set total amount to amount due if amount due is less than the current total amount but greater than the original amount',
                runInTransaction(async () => {
                    const amountDue = '800';
                    const updatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, {
                        amountDue,
                    });

                    expect(new BigNumber(infringement.totalAmount).isLessThan(amountDue)).toBeTruthy();
                    expect(new BigNumber(updatedInfringement.totalAmount).isEqualTo(amountDue)).toBeTruthy();

                    const newAmountDue = '700';
                    const newUpdatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, {
                        amountDue: newAmountDue,
                    });

                    expect(new BigNumber(newUpdatedInfringement.totalAmount).isGreaterThan(newAmountDue)).toBeTruthy();
                    expect(new BigNumber(newUpdatedInfringement.totalAmount).isEqualTo(updatedInfringement.totalAmount)).toBeTruthy();
                }),
            );

            it(
                'Should not set total amount to amount due if amount due is less than the current total amount',
                runInTransaction(async () => {
                    const amountDue = '800';
                    const updatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, {
                        amountDue,
                    });

                    expect(new BigNumber(infringement.totalAmount).isLessThan(amountDue)).toBeTruthy();
                    expect(new BigNumber(updatedInfringement.totalAmount).isEqualTo(amountDue)).toBeTruthy();

                    const newAmountDue = '0';
                    const newUpdatedInfringement = await updateInfringementService.updateInfringement(infringement.infringementId, {
                        amountDue: newAmountDue,
                    });

                    expect(new BigNumber(newUpdatedInfringement.totalAmount).isGreaterThan(newAmountDue)).toBeTruthy();
                    expect(new BigNumber(newUpdatedInfringement.totalAmount).isEqualTo(updatedInfringement.totalAmount)).toBeTruthy();
                }),
            );
        });
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
