import { INestApplication } from '@nestjs/common';
import { CreateAccountV1Service } from '@modules/account/services/create-account-v1.service';
import { TestApp } from '../helpers/test-app.singleton';
import { runInTransaction } from 'typeorm-test-transactions';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { CreateRoleService } from '@modules/role/services/create-role.service';
import { CreateAccountUserService } from '@modules/account-user/services/create-account-user.service';
import { CreateAccountUserDto } from '@modules/account-user/controllers/create-account-user.dto';
import { generator } from '@modules/shared/helpers/data-generators';

jest.setTimeout(15000);

describe('Create Account User Service', () => {
    let app: INestApplication;
    let createAccountService: CreateAccountV1Service;
    let createUserService: CreateUserService;
    let createAccountUserService: CreateAccountUserService;
    let createRoleService: CreateRoleService;

    beforeAll(async () => {
        app = await TestApp.app();
        createAccountService = app.get(CreateAccountV1Service);
        createAccountUserService = app.get(CreateAccountUserService);
        createUserService = app.get(CreateUserService);
        createRoleService = app.get(CreateRoleService);
    });

    describe('Create Account User Service', () => {
        it(
            'Should create account user for valid inputs',
            runInTransaction(async () => {
                const account = await generator.account();
                const user = await generator.user();
                const role = await generator.role();

                const accountUserData: CreateAccountUserDto = plainToClass(CreateAccountUserDto, {
                    userEmail: user.email,
                    userName: user.name,
                    userSurname: user.surname,
                    account: account.name,
                    roleNames: [role.name],
                });

                const accountUser = await createAccountUserService.createAccountUserAndCreateUserIfNotFound(accountUserData);

                expect(accountUser).toBeTruthy();
            }),
            20000,
        );

        it(
            'Should create account user and user when user doesnt exist',
            runInTransaction(async () => {
                const account = await generator.account();
                const role = await generator.role();

                const accountUserData: CreateAccountUserDto = plainToClass(CreateAccountUserDto, {
                    userEmail: faker.internet.email(),
                    userName: faker.name.firstName(),
                    userSurname: faker.name.lastName(),
                    account: account.name,
                    roleNames: [role.name],
                });

                const accountUser = await createAccountUserService.createAccountUserAndCreateUserIfNotFound(accountUserData);

                expect(accountUser).toBeTruthy();
                expect(accountUser.user.userId).toBeTruthy();
                expect(accountUser.user.email).toEqual(accountUserData.userEmail);
            }),
        );

        it(
            'Should not create account user when account doesnt exist',
            runInTransaction(async () => {
                const user = await generator.user();
                const role = await generator.role();

                const accountUserData: CreateAccountUserDto = plainToClass(CreateAccountUserDto, {
                    userEmail: user.email,
                    userName: user.name,
                    userSurname: user.surname,
                    account: faker.company.companyName(),
                    roleNames: [role.name],
                });

                let errorMessage: string;

                try {
                    const accountUser = await createAccountUserService.createAccountUserAndCreateUserIfNotFound(accountUserData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    errorMessage = e.message;
                }

                expect(errorMessage).toBeTruthy();
                expect(errorMessage).toEqual('Account not found');
            }),
        );

        it(
            'Should not create account user when role doesnt exist',
            runInTransaction(async () => {
                const account = await generator.account();
                const user = await generator.user();

                const accountUserData: CreateAccountUserDto = plainToClass(CreateAccountUserDto, {
                    userEmail: user.email,
                    userName: user.name,
                    userSurname: user.surname,
                    account: account.name,
                });

                let errorMessage: string;

                try {
                    const accountUser = await createAccountUserService.createAccountUserAndCreateUserIfNotFound(accountUserData);
                } catch (e) {
                    expect(e.message).toBeTruthy();
                    errorMessage = e.message;
                }

                expect(errorMessage).toBeTruthy();
                expect(errorMessage).toEqual('No Roles were found');
            }),
        );

        it(
            'Check that user password is not returned when user exists',
            runInTransaction(async () => {
                const account = await generator.account();
                const user = await generator.user();
                const role = await generator.role();

                const accountUserData: CreateAccountUserDto = plainToClass(CreateAccountUserDto, {
                    userEmail: user.email,
                    userName: user.name,
                    userSurname: user.surname,
                    account: account.name,
                    roleNames: [role.name],
                });

                const accountUser = await createAccountUserService.createAccountUserAndCreateUserIfNotFound(accountUserData);

                expect(accountUser).toBeTruthy();
                expect(accountUser.user.password).toBeUndefined();
            }),
        );

        it(
            'Check that user password is not returned when user doesnt exist',
            runInTransaction(async () => {
                const account = await generator.account();
                const role = await generator.role();

                const accountUserData: CreateAccountUserDto = plainToClass(CreateAccountUserDto, {
                    userEmail: faker.internet.email(),
                    userName: faker.name.firstName(),
                    userSurname: faker.name.lastName(),
                    account: account.name,
                    roleNames: [role.name],
                });

                const accountUser = await createAccountUserService.createAccountUserAndCreateUserIfNotFound(accountUserData);

                expect(accountUser).toBeTruthy();
                expect(accountUser.user.password).toBeFalsy();
            }),
        );

        it(
            'Should create account user from existing',
            runInTransaction(async () => {
                const account = await generator.account();
                const user = await generator.user();

                const accountUser = await createAccountUserService.createOneFromExisting(user, account);

                expect(accountUser).toBeTruthy();
                expect(accountUser.account.accountId).toEqual(account.accountId);
                expect(accountUser.user.email).toEqual(user.email);
            }),
        );

        it(
            'Should not create account users when no users are given',
            runInTransaction(async () => {
                const account = await generator.account();

                const accountUsers = await createAccountUserService.createManyFromExisting([], account);

                expect(accountUsers).toEqual([]);
            }),
        );

        it(
            'Should create multiple account users when multiple users are provided',
            runInTransaction(async () => {
                const account = await generator.account();
                const user1 = await generator.user();
                const user2 = await generator.user();
                const user3 = await generator.user();

                const accountUsers = await createAccountUserService.createManyFromExisting([user1, user2, user3], account);

                expect(accountUsers.length).toEqual(3);
            }),
        );
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
