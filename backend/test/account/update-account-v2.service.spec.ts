import { INestApplication } from '@nestjs/common';
import { TestApp } from '../helpers/test-app.singleton';
import { runInTransaction } from 'typeorm-test-transactions';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { generator } from '@modules/shared/helpers/data-generators';
import { AccountReporting } from '@entities';
import { CreateAccountV2Service } from '@modules/account/services/create-account-v2.service';
import { UpdateAccountV2Service } from '@modules/account/services/update-account-v2.service';
import { UpdateAccountV2Dto } from '@modules/account/controllers/update-account-v2-dto';
import { CreateAccountV2Dto } from '@modules/account/controllers/create-account-v2.dto';

describe('Update Account V2 Service', () => {
    let app: INestApplication;
    let createAccountService: CreateAccountV2Service;
    let updateAccountService: UpdateAccountV2Service;
    let commonIdentifier: string;

    beforeAll(async () => {
        app = await TestApp.app();
        createAccountService = app.get(CreateAccountV2Service);
        updateAccountService = app.get(UpdateAccountV2Service);
        commonIdentifier = faker.random.number(100000000).toString();
    });

    describe('Update Account V2 Service', () => {
        it(
            'Should update account with valid changes',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV2Dto = plainToClass(CreateAccountV2Dto, {
                    name: faker.random.word(),
                    identifier: commonIdentifier,
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    // Physical location
                    physicalLocation: {
                        streetName,
                        streetNumber,
                        city: faker.address.city(),
                        country: faker.address.country(),
                        code: faker.random.number(9999).toString(),
                    },
                });

                const account = await createAccountService.createAccount(accountData);
                expect(account).toBeTruthy();

                const name = 'UPDATED_NAME';
                const primaryContact = 'UPDATED_EMAIL';
                const role = 'Hybrid';

                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    name,
                    primaryContact,
                    role,
                });

                const updatedAccount = await updateAccountService.updateAccount(account.accountId, updateAccountData);

                expect(updatedAccount).toBeTruthy();
                expect(updatedAccount.accountId).toEqual(account.accountId);
                expect(updatedAccount.primaryContact).toEqual(primaryContact);
                expect(updatedAccount.role).toEqual(role);
            }),
        );

        it(
            'Should not update account identifier',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV2Dto = plainToClass(CreateAccountV2Dto, {
                    name: faker.random.word(),
                    identifier: commonIdentifier,
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    // Physical location
                    physicalLocation: {
                        streetName,
                        streetNumber,
                        city: faker.address.city(),
                        country: faker.address.country(),
                        code: faker.random.number(9999).toString(),
                    },
                });

                const account = await createAccountService.createAccount(accountData);
                expect(account).toBeTruthy();

                const identifier = 'UPDATED_BRN';

                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    identifier,
                });

                let errorMessage = '';

                try {
                    const updatedAccount = await updateAccountService.updateAccount(account.accountId, updateAccountData);
                } catch (e) {
                    errorMessage = e.message;
                }

                expect(errorMessage).toBeTruthy();
                expect(errorMessage).toEqual(
                    'We have disabled the ability to update account BRNs to prevent data corruption. Please contact us so that we can make this change for you if it is intended',
                );
            }),
        );

        it(
            'Should map inputs to valid formats',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV2Dto = plainToClass(CreateAccountV2Dto, {
                    name: faker.random.word(),
                    identifier: faker.random.number(100000000).toString(),
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    // Physical location
                    physicalLocation: {
                        streetName,
                        streetNumber,
                        city: faker.address.city(),
                        country: faker.address.country(),
                        code: faker.random.number(9999).toString(),
                    },
                });

                const account = await createAccountService.createAccount(accountData);
                expect(account).toBeTruthy();

                const name = 'UPDATED_NAME';
                const primaryContact = 'UPDATED_EMAIL';
                const role = 'hybrid';
                const newStreetName = 'UPDATED_STREET_NAME';
                const newStreetNumber = 25;
                const code = 2090;

                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    name,
                    primaryContact,
                    role,
                    // Physical location
                    physicalLocation: {
                        streetName: newStreetName,
                        streetNumber: newStreetNumber,
                        code,
                    },
                });

                const updatedAccount = await updateAccountService.updateAccount(account.accountId, updateAccountData);

                expect(updatedAccount).toBeTruthy();
                expect(updatedAccount.accountId).toEqual(account.accountId);
                expect(updatedAccount.physicalLocation.locationId).toEqual(account.physicalLocation.locationId);
                expect(updatedAccount.primaryContact).toEqual(primaryContact);
                expect(updatedAccount.role).toEqual('Hybrid');
                expect(updatedAccount.physicalLocation.streetName).toEqual(newStreetName);
                expect(updatedAccount.physicalLocation.streetNumber).toEqual(`${newStreetNumber}`);
                expect(updatedAccount.physicalLocation.code).toEqual(`${code}`);
            }),
        );

        it(
            'Should throw error if account does not exist',
            runInTransaction(async () => {
                const name = 'UPDATED_NAME';
                const identifier = 'UPDATED_IDENTIFIER';
                const primaryContact = 'UPDATED_EMAIL';
                const role = 'Hybrid';

                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    name,
                    identifier,
                    primaryContact,
                    role,
                });

                const accountId = faker.random.number(1000);
                try {
                    const updatedAccount = await updateAccountService.updateAccount(accountId, updateAccountData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toEqual(`Account with id ${accountId} not found`);
                }
            }),
        );

        it(
            'Should not update account with document that doesnt exist',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV2Dto = plainToClass(CreateAccountV2Dto, {
                    name: faker.random.word(),
                    identifier: faker.random.number(100000000).toString(),
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    streetName,
                    streetNumber,
                    city: faker.address.city(),
                    country: faker.address.country(),
                    code: faker.random.number(9999).toString(),
                });

                const account = await createAccountService.createAccount(accountData);
                expect(account).toBeTruthy();

                const documentId = faker.random.number(1000);
                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    documentId,
                });

                try {
                    const updatedAccount = await updateAccountService.updateAccount(account.accountId, updateAccountData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toEqual('Failed to update account, please contact the developers.');
                }
            }),
        );

        it(
            'Should update account with document',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV2Dto = plainToClass(CreateAccountV2Dto, {
                    name: faker.random.word(),
                    identifier: faker.random.number(100000000).toString(),
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    streetName,
                    streetNumber,
                    city: faker.address.city(),
                    country: faker.address.country(),
                    code: faker.random.number(9999).toString(),
                });

                const account = await createAccountService.createAccount(accountData);
                expect(account).toBeTruthy();

                const document = await generator.document({ fileDirectory: './tests' });

                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    documentId: document.documentId,
                });

                const updatedAccount = await updateAccountService.updateAccount(account.accountId, updateAccountData);

                expect(updatedAccount).toBeTruthy();
                expect(updatedAccount.powerOfAttorney).toEqual(document);
            }),
        );

        it(
            'Should update account with account reporting object',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV2Dto = plainToClass(CreateAccountV2Dto, {
                    name: faker.random.word(),
                    identifier: commonIdentifier,
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    streetName,
                    streetNumber,
                    city: faker.address.city(),
                    country: faker.address.country(),
                    code: faker.random.number(9999).toString(),
                });

                const account = await createAccountService.createAccount(accountData);
                expect(account).toBeTruthy();

                const accountReporting: AccountReporting = {
                    receiveWeeklyReport: true,
                    ccAddress: ['updatedAddress@test.co'],
                    customSignature: 'Custom signature',
                    emailBody: 'Email body',
                };

                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    accountReporting,
                });

                const updatedAccount = await updateAccountService.updateAccount(account.accountId, updateAccountData);

                expect(updatedAccount).toBeTruthy();
                expect(updatedAccount.accountId).toEqual(account.accountId);
                expect(updatedAccount.accountReporting).toEqual(accountReporting);
            }),
        );

        it(
            'Should update account with account reporting object when it already exists',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV2Dto = plainToClass(CreateAccountV2Dto, {
                    name: faker.random.word(),
                    identifier: commonIdentifier,
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    streetName,
                    streetNumber,
                    city: faker.address.city(),
                    country: faker.address.country(),
                    code: faker.random.number(9999).toString(),
                    accountReporting: {
                        receiveWeeklyReport: false,
                        ccAddress: ['ccAddress@test.co'],
                    },
                });

                const account = await createAccountService.createAccount(accountData);
                expect(account).toBeTruthy();

                const accountReporting: AccountReporting = {
                    receiveWeeklyReport: true,
                    ccAddress: ['updatedAddress@test.co'],
                    customSignature: 'Custom signature',
                    emailBody: 'Email body',
                };

                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    accountReporting,
                });

                const updatedAccount = await updateAccountService.updateAccount(account.accountId, updateAccountData);

                expect(updatedAccount).toBeTruthy();
                expect(updatedAccount.accountId).toEqual(account.accountId);
                expect(updatedAccount.accountReporting).toEqual(accountReporting);
            }),
        );

        it(
            'Should update account with account reporting object when only some fields need to be updated',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV2Dto = plainToClass(CreateAccountV2Dto, {
                    name: faker.random.word(),
                    identifier: commonIdentifier,
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    streetName,
                    streetNumber,
                    city: faker.address.city(),
                    country: faker.address.country(),
                    code: faker.random.number(9999).toString(),
                    accountReporting: {
                        receiveWeeklyReport: false,
                        ccAddress: ['ccAddress@test.co'],
                        customSignature: 'Custom signature',
                    },
                });

                const account = await createAccountService.createAccount(accountData);
                expect(account).toBeTruthy();

                const accountReporting: AccountReporting = {
                    receiveWeeklyReport: true,
                    ccAddress: ['updatedAddress@test.co'],
                    emailBody: 'Email body',
                };

                const updateAccountData: UpdateAccountV2Dto = plainToClass(UpdateAccountV2Dto, {
                    accountReporting,
                });

                const updatedAccount = await updateAccountService.updateAccount(account.accountId, updateAccountData);

                expect(updatedAccount).toBeTruthy();
                expect(updatedAccount.accountId).toEqual(account.accountId);
                expect(updatedAccount.accountReporting.receiveWeeklyReport).toEqual(accountReporting.receiveWeeklyReport);
                expect(updatedAccount.accountReporting.ccAddress).toEqual(accountReporting.ccAddress);
                expect(updatedAccount.accountReporting.emailBody).toEqual(accountReporting.emailBody);
                expect(updatedAccount.accountReporting.customSignature).toEqual('Custom signature');
            }),
        );
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
