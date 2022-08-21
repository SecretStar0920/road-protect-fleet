import { INestApplication } from '@nestjs/common';
import { TestApp } from '../helpers/test-app.singleton';
import { runInTransaction } from 'typeorm-test-transactions';
import { GenerateAccountRelationService } from '@modules/account-relation/services/generate-account-relation.service';
import * as faker from 'faker';
import { generator } from '@modules/shared/helpers/data-generators';
import { AccountRole } from '@entities';
import * as moment from 'moment';
import { getConnection } from 'typeorm';

describe('Generate Account Relation Service', () => {
    let app: INestApplication;
    let generateAccountRelationService: GenerateAccountRelationService;

    beforeAll(async () => {
        app = await TestApp.app();
        generateAccountRelationService = app.get(GenerateAccountRelationService);
    });

    afterAll(async () => {
        const connection = getConnection();
        // }
        const entities = connection.entityMetadatas;

        for (const entity of entities) {
            const repository = await connection.getRepository(entity.name);
            await repository.query(`DELETE FROM "${entity.tableName}";`);
        }

        await TestApp.closeApp();
    });

    describe('Generate Account Relation Service', () => {
        it(
            'Should create account relation when a contract exists for the account',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account();
                const owner = await generator.account({ role: AccountRole.Owner });
                const vehicle = await generator.vehicle();

                const contract = await generator.leaseContract({ startDate, user, owner, vehicle });

                const accountRelations = await generateAccountRelationService.generateAccountRelationsFromContracts(user.accountId);

                expect(accountRelations).toBeTruthy();
                expect(accountRelations.length).toEqual(1);
                expect(accountRelations[0].data.customFields['From contract with Id']).toEqual(contract.contractId);
            }),
        );

        it(
            'Should create account relation as an owner',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account();
                const owner = await generator.account();
                const vehicle = await generator.vehicle();

                const contract = await generator.leaseContract({ startDate, user, owner, vehicle });

                const accountRelations = await generateAccountRelationService.generateAccountRelationsFromContracts(owner.accountId);

                expect(accountRelations).toBeTruthy();
                expect(accountRelations.length).toEqual(1);
                expect(accountRelations[0].reverse.accountId).toEqual(owner.accountId);
                expect(accountRelations[0].data.summary).toEqual(
                    '[Automatically generated] They use or have used vehicle(s) owned by this account',
                );
            }),
        );

        it(
            'Should create account relation as a user',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account();
                const owner = await generator.account();
                const vehicle = await generator.vehicle();

                const contract = await generator.leaseContract({ startDate, user, owner, vehicle });

                const accountRelations = await generateAccountRelationService.generateAccountRelationsFromContracts(user.accountId);

                expect(accountRelations).toBeTruthy();
                expect(accountRelations.length).toEqual(1);
                expect(accountRelations[0].reverse.accountId).toEqual(user.accountId);
                expect(accountRelations[0].data.summary).toEqual(
                    '[Automatically Generated] They own or have owned vehicle(s) used by this account',
                );
            }),
        );

        it(
            'Should create account relations as a user and owner',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const accountA = await generator.account();
                const accountB = await generator.account();
                const vehicle = await generator.vehicle();

                const contract = await generator.leaseContract({ startDate, user: accountA, owner: accountB, vehicle });
                const accountRelations1 = await generateAccountRelationService.generateAccountRelationsFromContracts(accountA.accountId);

                expect(accountRelations1).toBeTruthy();
                expect(accountRelations1.length).toEqual(1);
                expect(accountRelations1[0].reverse.accountId).toEqual(accountA.accountId);

                const accountRelations2 = await generateAccountRelationService.generateAccountRelationsFromContracts(accountB.accountId);

                expect(accountRelations2).toBeTruthy();
                expect(accountRelations2.length).toEqual(1);
                expect(accountRelations2[0].reverse.accountId).toEqual(accountB.accountId);
            }),
        );

        it('Should create account relation even if another exists with another account', async () => {
            const startDate = moment().toISOString();
            const accountA = await generator.account();
            const accountB = await generator.account();
            const accountC = await generator.account();
            const vehicle1 = await generator.vehicle();
            const vehicle2 = await generator.vehicle();

            const contract1 = await generator.leaseContract({ startDate, user: accountB, owner: accountA, vehicle: vehicle1 });
            const accountRelations1 = await generateAccountRelationService.generateAccountRelationsFromContracts(accountB.accountId);

            expect(accountRelations1).toBeTruthy();
            expect(accountRelations1.length).toEqual(1);
            expect(accountRelations1[0].reverse.accountId).toEqual(accountB.accountId);
            expect(accountRelations1[0].forward.accountId).toEqual(accountA.accountId);

            const contract2 = await generator.leaseContract({ startDate, user: accountB, owner: accountC, vehicle: vehicle2 });

            const accountRelations2 = await generateAccountRelationService.generateAccountRelationsFromContracts(accountB.accountId);

            expect(accountRelations2).toBeTruthy();
            expect(accountRelations2.length).toEqual(2);
        });

        it(
            'Should not create account relations when no contract exists for the account',
            runInTransaction(async () => {
                const account = await generator.account();
                const accountRelations = await generateAccountRelationService.generateAccountRelationsFromContracts(account.accountId);

                expect(accountRelations).toBeTruthy();
                expect(accountRelations).toEqual([]);
            }),
        );

        it(
            'Should not create account relations when account does not exist',
            runInTransaction(async () => {
                let errorMessage: string;

                try {
                    const accountRelations = await generateAccountRelationService.generateAccountRelationsFromContracts(
                        faker.random.number(1000),
                    );
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    errorMessage = e.message;
                }

                expect(errorMessage).toEqual('Account not found');
            }),
        );
    });
});
