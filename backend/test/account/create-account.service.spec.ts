import { INestApplication } from '@nestjs/common';
import { CreateAccountV1Service } from '@modules/account/services/create-account-v1.service';
import { TestApp } from '../helpers/test-app.singleton';
import { runInTransaction } from 'typeorm-test-transactions';
import { CreateAccountV1Dto } from '@modules/account/controllers/create-account-v1.dto';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { Role, User, UserType } from '@entities';
import { GetAccountUsersForAccountService } from '@modules/account-user/services/get-account-users-for-account.service';
import { validate } from 'class-validator';
import { generator } from '@modules/shared/helpers/data-generators';
import { CreateRoleService } from '@modules/role/services/create-role.service';

jest.setTimeout(15000);

describe('Create Account Service', () => {
    let app: INestApplication;
    let createAccountService: CreateAccountV1Service;
    let createRoleService: CreateRoleService;
    let getAccountUsersForAccountService: GetAccountUsersForAccountService;
    let commonIdentifier: string;

    beforeAll(async () => {
        app = await TestApp.app();
        createAccountService = app.get(CreateAccountV1Service);
        createRoleService = app.get(CreateRoleService);
        getAccountUsersForAccountService = app.get(GetAccountUsersForAccountService);
        commonIdentifier = faker.random.number(100000000).toString();
    });

    describe('Create Account Service', () => {
        it(
            'Should create account for valid inputs',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV1Dto = plainToClass(CreateAccountV1Dto, {
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
            }),
        );
        //
        it(
            'Should not create account without location',
            runInTransaction(async () => {
                const accountData: CreateAccountV1Dto = plainToClass(CreateAccountV1Dto, {
                    name: faker.random.word(),
                    identifier: faker.random.number(100000000),
                    isVerified: false,
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                });

                try {
                    const account = await createAccountService.createAccount(accountData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toBe(`No valid locations were provided, neither Postal nor Physical`);
                }
            }),
        );

        it(
            'Should not create account without location when invalid location values are given',
            runInTransaction(async () => {
                const accountData: CreateAccountV1Dto = plainToClass(CreateAccountV1Dto, {
                    name: faker.random.word(),
                    identifier: faker.random.number(100000000),
                    isVerified: false,
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    city: faker.address.city(),
                    country: faker.lorem.word(),
                    code: faker.random.number(9999).toString(),
                });

                try {
                    const account = await createAccountService.createAccount(accountData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toBe(`No valid locations were provided, neither Postal nor Physical`);
                }
            }),
        );

        it(
            'Account not created when identifier in non-unique',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.alphaNumeric(3);

                const accountData: CreateAccountV1Dto = plainToClass(CreateAccountV1Dto, {
                    name: faker.random.word(),
                    identifier: commonIdentifier,
                    primaryContact: faker.internet.email(),
                    role: 'Owner',
                    streetName,
                    streetNumber,
                    city: faker.address.city(),
                    country: faker.address.country(),
                    code: faker.random.alphaNumeric(4),
                });

                try {
                    const account = await createAccountService.createAccount(accountData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    expect(e.message).toBe(`An account with this identifier already exists`);
                }
            }),
        );

        it(
            'Should map inputs to valid input types',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: number = 25;
                const identifier: number = faker.random.number(100000000);

                const accountData: CreateAccountV1Dto = plainToClass(CreateAccountV1Dto, {
                    name: faker.random.word(),
                    identifier,
                    primaryContact: faker.internet.email(),
                    role: 'owner',
                    streetName,
                    streetNumber,
                    city: faker.address.city(),
                    country: faker.address.country(),
                    code: 2090,
                });

                try {
                    const account = await createAccountService.createAccount(accountData);
                    expect(account).toBeTruthy();
                    expect(account.physicalLocation.streetNumber).toEqual('25');
                    expect(account.identifier).toEqual(`${identifier}`);
                    expect(account.physicalLocation.code).toEqual('2090');
                    expect(account.role).toEqual('Owner');
                } catch (e) {
                    throw e;
                }
            }),
        );

        it(
            'Should not create account if the role given is not in enum AccountRole',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV1Dto = plainToClass(CreateAccountV1Dto, {
                    name: faker.random.word(),
                    identifier: faker.random.number(100000000).toString(),
                    primaryContact: faker.internet.email(),
                    role: 'Incorrect',
                    streetName,
                    streetNumber,
                    city: faker.address.city(),
                    country: faker.address.country(),
                    code: faker.random.number(9999).toString(),
                });

                const errors = await validate(accountData);
                expect(errors.length).toBeGreaterThan(0);
            }),
        );

        it(
            'Should create account when optional fields are specified',
            runInTransaction(async () => {
                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV1Dto = plainToClass(CreateAccountV1Dto, {
                    name: faker.random.word(),
                    identifier: faker.random.number(100000000).toString(),
                    isVerified: true,
                    primaryContact: faker.internet.email(),
                    contactName: faker.name.findName(),
                    contactTelephone: '(410) 282-9236',
                    contactFax: '+1 323 555 1234',
                    role: 'Hybrid',
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
                expect(account.details.fax).toEqual('+1 323 555 1234');
                expect(account.details.telephone).toEqual('(410) 282-9236');
                expect(account.accountReporting.receiveWeeklyReport).toEqual(false);
                expect(account.accountReporting.ccAddress).toEqual(['ccAddress@test.co']);
                expect(account.accountReporting.customSignature).toEqual('Custom signature');
            }),
        );

        it(
            'Should link account to system admin',
            runInTransaction(async () => {
                // create admin user
                const user = await generator.user({ type: UserType.Developer });
                const admins = await User.getAdmins();

                // check that system administrator role exists, create it if it doesn't
                let role = await Role.findOne({ name: 'System Administrator' });
                if (!role) {
                    role = await generator.role({ name: 'System Administrator' });
                }

                const streetName: string = faker.address.streetName();
                const streetNumber: string = faker.random.number(1000).toString();

                const accountData: CreateAccountV1Dto = plainToClass(CreateAccountV1Dto, {
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

                const usersForAccount = await getAccountUsersForAccountService.getAccountUsersForAccount(account.accountId);
                expect(
                    usersForAccount.map((accountUsers) => {
                        return accountUsers.userId;
                    }),
                ).toEqual(
                    admins.map((users) => {
                        return users.userId;
                    }),
                );
            }),
        );
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
