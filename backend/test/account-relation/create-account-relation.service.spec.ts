import { INestApplication } from '@nestjs/common';
import { TestApp } from '../helpers/test-app.singleton';
import { runInTransaction } from 'typeorm-test-transactions';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { CreateAccountRelationService } from '@modules/account-relation/services/create-account-relation.service';
import { generator } from '@modules/shared/helpers/data-generators';
import { CreateAccountRelationDto } from '@modules/account-relation/controllers/account-relation.controller';

describe('Create Account Relation Service', () => {
    let app: INestApplication;
    let createAccountRelationService: CreateAccountRelationService;

    beforeAll(async () => {
        app = await TestApp.app();
        createAccountRelationService = app.get(CreateAccountRelationService);
    });

    describe('Create Account Relation Service', () => {
        it(
            'Should create account relation for valid inputs',
            runInTransaction(async () => {
                const forwardAccount = await generator.account();
                const reverseAccount = await generator.account();

                const accountRelationData = plainToClass(CreateAccountRelationDto, {
                    forwardAccountId: forwardAccount.accountId,
                    reverseAccountId: reverseAccount.accountId,
                    data: {
                        summary: faker.random.words(6),
                    },
                });

                const accountRelation = await createAccountRelationService.createAccountRelation(accountRelationData);

                expect(accountRelation).toBeTruthy();
                expect(accountRelation.forward.identifier).toEqual(forwardAccount.identifier);
                expect(accountRelation.reverse.identifier).toEqual(reverseAccount.identifier);
            }),
        );

        it(
            'Should not create account relation for invalid forward account',
            runInTransaction(async () => {
                const forwardAccount = await faker.random.number(10000);
                const reverseAccount = await generator.account();

                const accountRelationData = plainToClass(CreateAccountRelationDto, {
                    forwardAccountId: forwardAccount,
                    reverseAccountId: reverseAccount.accountId,
                    data: {
                        summary: faker.random.words(6),
                    },
                });

                let errorMessage: string = '';
                try {
                    const accountRelation = await createAccountRelationService.createAccountRelation(accountRelationData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    errorMessage = e.message;
                }

                expect(errorMessage).toEqual('Primary / Forward account not found');
            }),
        );

        it(
            'Should not create account relation for invalid reverse account',
            runInTransaction(async () => {
                const reverseAccount = await faker.random.number(10000);
                const forwardAccount = await generator.account();

                const accountRelationData = plainToClass(CreateAccountRelationDto, {
                    forwardAccountId: forwardAccount.accountId,
                    reverseAccountId: reverseAccount,
                    data: {
                        summary: faker.random.words(6),
                    },
                });

                let errorMessage: string = '';
                try {
                    const accountRelation = await createAccountRelationService.createAccountRelation(accountRelationData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    errorMessage = e.message;
                }

                expect(errorMessage).toEqual('Target / Reverse account not found');
            }),
        );

        it(
            'Should not create account relation when forward and reverse accounts are the same',
            runInTransaction(async () => {
                const forwardAccount = await generator.account();
                const reverseAccount = forwardAccount;

                const accountRelationData = plainToClass(CreateAccountRelationDto, {
                    forwardAccountId: forwardAccount.accountId,
                    reverseAccountId: reverseAccount.accountId,
                    data: {
                        summary: faker.random.words(6),
                    },
                });

                let errorMessage: string = '';
                try {
                    const accountRelation = await createAccountRelationService.createAccountRelation(accountRelationData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    errorMessage = e.message;
                }

                expect(errorMessage).toEqual('Relation cannot be created between two accounts which are the same');
            }),
        );
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
