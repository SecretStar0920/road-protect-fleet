import { AccountRole, Client, Infringement, Issuer, RawInfringementStatus } from '@entities';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { generator } from '@modules/shared/helpers/data-generators';
import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';
import { get } from 'lodash';
import { getConnection } from 'typeorm';
import { runInTransaction } from 'typeorm-test-transactions';
import { TestApp } from '../helpers/test-app.singleton';
import * as moment from 'moment';

describe('Create Raw Infringement Service', () => {
    let app: INestApplication;
    let createRawInfringementService: CreateRawInfringementService;
    let client: Client;
    let noMapperClient: Client;
    let existingInfringement: Infringement;
    let existingIssuer: Issuer;

    beforeAll(async () => {
        app = await TestApp.app();
        client = await generator.client({ name: 'old-israel-fleet' });
        existingIssuer = await generator.issuer({ code: '10' });
        existingInfringement = await generator.infringement({ noticeNumber: '1234567', issuer: existingIssuer });
        noMapperClient = await generator.client();
        createRawInfringementService = app.get(CreateRawInfringementService);
    });

    describe('Create Raw Infringement Service', () => {
        it(
            'Should create raw infringement and infringement',
            runInTransaction(async () => {
                const issuer = await generator.issuer({ code: '874', name: 'TestCityName' });
                const vehicle = await generator.vehicle({ registration: 'TestRegistration' });
                const body = {
                    fine_id: '19897024',
                    fine_seq: '1087419897024',
                    city_name: issuer.name,
                    cust_name: 'כ.צ.ט. בע"מ',
                    fine_debit: null,
                    fine_amount: '1000',
                    fine_branch: '13א',
                    fine_driver: null,
                    fine_status: '2',
                    fine_street: 'העצמאות מול 3 מגדל העמק',
                    fine_trx_id: null,
                    fine_veh_id: vehicle.registration,
                    fine_trx_msg: null,
                    fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
                    fine_action_date: '2017-10-23 11:45:00',
                    fine_end_cust_id: '512562422',
                    fine_import_date: '2020-01-26 17:04:00',
                    fine_status_date: '2020-01-26 17:04:00',
                    fine_verify_date: '2020-03-08 00:00:00',
                    fine_amount_payed: null,
                    fine_pay_due_date: '2018-03-13 00:00:00',
                    fine_driver_charge: null,
                    fine_transfer_date: null,
                };

                const rawInfringement = await createRawInfringementService.createRawInfringement(body, client);

                expect(rawInfringement).toBeTruthy();
                expect(rawInfringement.infringement.noticeNumber).toEqual(body.fine_id);
                expect(rawInfringement.raw.noticeNumber).toEqual(body.fine_id);
                expect(rawInfringement.raw.clientId).toEqual(client.clientId);
                expect(rawInfringement.raw.status).toEqual(RawInfringementStatus.Completed);
            }),
        );

        it(
            'Should create raw infringement but not map to an infringement if no client mapper',
            runInTransaction(async () => {
                const issuer = await generator.issuer({ code: '874', name: 'TestCityName' });
                const vehicle = await generator.vehicle({ registration: 'TestRegistration' });
                const body = {
                    fine_id: '19897024',
                    fine_seq: '1087419897024',
                    city_name: issuer.name,
                    cust_name: 'כ.צ.ט. בע"מ',
                    fine_debit: null,
                    fine_amount: '100',
                    fine_branch: '13א',
                    fine_driver: null,
                    fine_status: '2',
                    fine_street: 'העצמאות מול 3 מגדל העמק',
                    fine_trx_id: null,
                    fine_veh_id: vehicle.registration,
                    fine_trx_msg: null,
                    fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
                    fine_action_date: '2017-10-23 11:45:00',
                    fine_end_cust_id: '512562422',
                    fine_import_date: '2020-01-26 17:04:00',
                    fine_status_date: '2020-01-26 17:04:00',
                    fine_verify_date: '2020-03-08 00:00:00',
                    fine_amount_payed: null,
                    fine_pay_due_date: '2018-03-13 00:00:00',
                    fine_driver_charge: null,
                    fine_transfer_date: null,
                };

                const rawInfringement = await createRawInfringementService.createRawInfringement(body, noMapperClient);

                expect(rawInfringement).toBeTruthy();
                expect(rawInfringement.infringement).toBeFalsy();
                expect(rawInfringement.raw.clientId).toEqual(noMapperClient.clientId);
                expect(rawInfringement.raw.status).toEqual(RawInfringementStatus.Failed);
                expect(rawInfringement.raw.result.message).toEqual('No mapper for this client');
            }),
        );

        it(
            'Should create raw infringement and not update existing infringement with outdated information',
            runInTransaction(async () => {
                const oldFleetCityCode = 10000 + Number(get(existingInfringement, 'issuer.code'));
                const fineSequence = `${oldFleetCityCode}${existingInfringement.noticeNumber}`;

                const body = {
                    fine_id: existingInfringement.noticeNumber,
                    fine_seq: fineSequence,
                    city_name: existingInfringement.issuer.name,
                    cust_name: 'כ.צ.ט. בע"מ',
                    fine_debit: null,
                    fine_amount: '1000',
                    fine_branch: '13א',
                    fine_driver: null,
                    fine_status: '2',
                    fine_street: 'העצמאות מול 3 מגדל העמק',
                    fine_trx_id: null,
                    fine_veh_id: existingInfringement.vehicle.registration,
                    fine_trx_msg: null,
                    fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
                    fine_action_date: '2010-10-23 11:45:00',
                    fine_end_cust_id: '512562422',
                    fine_import_date: '2011-01-26 17:04:00',
                    fine_status_date: '2012-01-26 17:04:00',
                    fine_verify_date: '2012-03-08 00:00:00',
                    fine_amount_payed: null,
                    fine_pay_due_date: '2011-03-13 00:00:00',
                    fine_driver_charge: null,
                    fine_transfer_date: null,
                };

                const rawInfringement = await createRawInfringementService.createRawInfringement(body, client);

                expect(rawInfringement).toBeTruthy();
                expect(rawInfringement.raw.clientId).toEqual(client.clientId);
                expect(rawInfringement.raw.status).toEqual(RawInfringementStatus.Completed);
                expect(rawInfringement.raw.result.result.perform).toEqual(true);

                const bodyOutdated = {
                    ...body,
                    fine_status_date: '2012-01-26 17:03:00',
                };

                const duplicateRawInfringement = await createRawInfringementService.createRawInfringement(bodyOutdated, client);

                expect(duplicateRawInfringement).toBeTruthy();
                expect(duplicateRawInfringement.raw.clientId).toEqual(client.clientId);
                expect(duplicateRawInfringement.raw.status).toEqual(RawInfringementStatus.Completed);
                expect(duplicateRawInfringement.raw.result.result.perform).toEqual(false);
                expect(duplicateRawInfringement.raw.result.result.additional.message).toEqual(
                    'No update performed due to outdated information',
                );
            }),
        );

        it(
            'Should create raw infringement and update existing infringement with new information',
            runInTransaction(async () => {
                const oldFleetCityCode = 10000 + Number(get(existingInfringement, 'issuer.code'));
                const fineSequence = `${oldFleetCityCode}${existingInfringement.noticeNumber}`;

                const body = {
                    fine_id: existingInfringement.noticeNumber,
                    fine_seq: fineSequence,
                    city_name: existingInfringement.issuer.name,
                    cust_name: 'כ.צ.ט. בע"מ',
                    fine_debit: null,
                    fine_amount: '1000',
                    fine_branch: '13א',
                    fine_driver: null,
                    fine_status: '2',
                    fine_street: 'העצמאות מול 3 מגדל העמק',
                    fine_trx_id: null,
                    fine_veh_id: existingInfringement.vehicle.registration,
                    fine_trx_msg: null,
                    fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
                    fine_action_date: '2019-10-23 11:45:00',
                    fine_end_cust_id: '512562422',
                    fine_import_date: '2020-01-26 17:04:00',
                    fine_status_date: '2020-01-26 17:04:00',
                    fine_verify_date: faker.date.future(),
                    fine_amount_payed: null,
                    fine_pay_due_date: '2021-03-13 00:00:00',
                    fine_driver_charge: null,
                    fine_transfer_date: null,
                };

                const rawInfringement = await createRawInfringementService.createRawInfringement(body, client);

                expect(rawInfringement).toBeTruthy();
                expect(rawInfringement.raw.clientId).toEqual(client.clientId);
                expect(rawInfringement.raw.status).toEqual(RawInfringementStatus.Completed);
                expect(rawInfringement.raw.result.result.perform).toEqual(true);
                expect(rawInfringement.infringement).toBeTruthy();
                expect(rawInfringement.infringement.noticeNumber).toEqual(existingInfringement.noticeNumber);
                expect(rawInfringement.raw.noticeNumber).toEqual(existingInfringement.noticeNumber);
                expect(rawInfringement.infringement.issuer.code).toEqual(get(existingInfringement, 'issuer.code'));
                expect(rawInfringement.raw.issuer).toEqual(get(existingInfringement, 'issuer.code'));
            }),
        );

        it(
            'Should create raw infringement and not an infringement if the vehicle does not exist in the system',
            runInTransaction(async () => {
                const issuer = await generator.issuer({ code: '874', name: 'TestCityName' });
                const body = {
                    fine_id: '19897024',
                    fine_seq: '1087419897024',
                    city_name: issuer.name,
                    cust_name: 'כ.צ.ט. בע"מ',
                    fine_debit: null,
                    fine_amount: '1000',
                    fine_branch: '13א',
                    fine_driver: null,
                    fine_status: '2',
                    fine_street: 'העצמאות מול 3 מגדל העמק',
                    fine_trx_id: null,
                    fine_veh_id: 'NonExistingVehicle',
                    fine_trx_msg: null,
                    fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
                    fine_action_date: '2017-10-23 11:45:00',
                    fine_end_cust_id: '512562422',
                    fine_import_date: '2020-01-26 17:04:00',
                    fine_status_date: '2020-01-26 17:04:00',
                    fine_verify_date: '2020-03-08 00:00:00',
                    fine_amount_payed: null,
                    fine_pay_due_date: '2018-03-13 00:00:00',
                    fine_driver_charge: null,
                    fine_transfer_date: null,
                };

                const rawInfringement = await createRawInfringementService.createRawInfringement(body, client);

                expect(rawInfringement).toBeTruthy();
                expect(rawInfringement.infringement).toBeFalsy();
                expect(rawInfringement.raw.status).toEqual(RawInfringementStatus.Failed);
                expect(rawInfringement.raw.result.message).toEqual(`Vehicle ${body.fine_veh_id} not found`);
            }),
        );

        it(
            'Should create raw infringement and infringement with the correct timezone',
            runInTransaction(async () => {
                const issuer = await generator.issuer({ code: '874', name: 'TestCityName' });
                const vehicle = await generator.vehicle({ registration: 'TestRegistration' });
                const body = {
                    fine_id: '19897024',
                    fine_seq: '1087419897024',
                    city_name: issuer.name,
                    cust_name: 'כ.צ.ט. בע"מ',
                    fine_debit: null,
                    fine_amount: '1000',
                    fine_branch: '13א',
                    fine_driver: null,
                    fine_status: '2',
                    fine_street: 'העצמאות מול 3 מגדל העמק',
                    fine_trx_id: null,
                    fine_veh_id: vehicle.registration,
                    fine_trx_msg: null,
                    fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
                    fine_action_date: '2017-07-23 11:45:00', // Offence Date (Winter)
                    fine_end_cust_id: '512562422',
                    fine_import_date: '2020-01-26 17:04:00',
                    fine_status_date: '2020-01-26 17:04:00',
                    fine_verify_date: '2020-03-08 00:00:00',
                    fine_amount_payed: null,
                    fine_pay_due_date: '2018-02-13 00:00:00', // Due Date (Summer)
                    fine_driver_charge: null,
                    fine_transfer_date: null,
                };

                const rawInfringement = await createRawInfringementService.createRawInfringement(body, client);

                expect(rawInfringement).toBeTruthy();
                expect(rawInfringement.infringement.noticeNumber).toEqual(body.fine_id);
                expect(rawInfringement.raw.noticeNumber).toEqual(body.fine_id);
                expect(rawInfringement.raw.clientId).toEqual(client.clientId);
                expect(rawInfringement.raw.status).toEqual(RawInfringementStatus.Completed);
                // Winter, thus shift by 2 hours compared to fine_pay_due_date
                expect(rawInfringement.infringement.latestPaymentDate.toString()).toEqual(
                    'Mon Feb 12 2018 22:00:00 GMT+0000 (Coordinated Universal Time)',
                );
                // Summer, thus shift by 3 hours compared to fine_action_date
                expect(rawInfringement.infringement.offenceDate.toString()).toEqual(
                    'Sun Jul 23 2017 08:45:00 GMT+0000 (Coordinated Universal Time)',
                );
            }),
        );

        // @emily I'm not sure we need this approved date to change?
        // it(
        //     'Should create nomination with given approved date when creating an infringement from raw infringement',
        //     runInTransaction(async () => {
        //         const issuer = await generator.issuer({ code: '874', name: 'TestCityName' });
        //         const vehicle = await generator.vehicle({ registration: 'TestRegistration' });
        //         const account = await generator.account({ role: AccountRole.Owner, identifier: '512562422' });
        //         const approvedDate = '2020-03-08 00:00:00';
        //         const body = {
        //             fine_id: '19897024',
        //             fine_seq: '1087419897024',
        //             city_name: issuer.name,
        //             cust_name: 'כ.צ.ט. בע"מ',
        //             fine_debit: null,
        //             fine_amount: '1000',
        //             fine_branch: '13א',
        //             fine_driver: null,
        //             fine_status: '2',
        //             fine_street: 'העצמאות מול 3 מגדל העמק',
        //             fine_trx_id: null,
        //             fine_veh_id: vehicle.registration,
        //             fine_trx_msg: null,
        //             fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
        //             fine_action_date: '2017-10-23 11:45:00',
        //             fine_end_cust_id: account.identifier,
        //             fine_import_date: '2020-01-26 17:04:00',
        //             fine_status_date: '2020-01-26 17:04:00',
        //             fine_verify_date: approvedDate,
        //             fine_amount_payed: null,
        //             fine_pay_due_date: '2018-03-13 00:00:00',
        //             fine_driver_charge: null,
        //             fine_transfer_date: null,
        //         };
        //
        //         const raw = await createRawInfringementService.createRawInfringement(body, client);
        //         const nomination = raw.infringement.nomination;
        //         expect(nomination).toBeTruthy();
        //         const datesEqual = moment(approvedDate).isSame(moment(nomination.approvedDate));
        //         expect(datesEqual).toBeTruthy();
        //     }),
        // );

        // it(
        //     'Should update nomination with given approved date when updating an infringement from raw infringement',
        //     runInTransaction(async () => {
        //         const issuer = await generator.issuer({ code: '874', name: 'TestCityName' });
        //         const vehicle = await generator.vehicle({ registration: 'TestRegistration' });
        //         const account = await generator.account({ role: AccountRole.Owner, identifier: '512562422' });
        //         const originalApprovedDate = '2020-03-08 00:00:00';
        //         const body = {
        //             fine_id: '19897024',
        //             fine_seq: '1087419897024',
        //             city_name: issuer.name,
        //             cust_name: 'כ.צ.ט. בע"מ',
        //             fine_debit: null,
        //             fine_amount: '1000',
        //             fine_branch: '13א',
        //             fine_driver: null,
        //             fine_status: '2',
        //             fine_street: 'העצמאות מול 3 מגדל העמק',
        //             fine_trx_id: null,
        //             fine_veh_id: vehicle.registration,
        //             fine_trx_msg: null,
        //             fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
        //             fine_action_date: '2017-10-23 11:45:00',
        //             fine_end_cust_id: account.identifier,
        //             fine_import_date: '2020-01-26 17:04:00',
        //             fine_status_date: '2020-01-26 17:04:00',
        //             fine_verify_date: originalApprovedDate,
        //             fine_amount_payed: null,
        //             fine_pay_due_date: '2018-03-13 00:00:00',
        //             fine_driver_charge: null,
        //             fine_transfer_date: null,
        //         };
        //
        //         const raw = await createRawInfringementService.createRawInfringement(body, client);
        //         const originalNomination = raw.infringement.nomination;
        //
        //         const updatedApprovedDate = '2020-03-10 00:00:00';
        //         const updatedBody = {
        //             fine_id: '19897024',
        //             fine_seq: '1087419897024',
        //             city_name: issuer.name,
        //             cust_name: 'כ.צ.ט. בע"מ',
        //             fine_debit: null,
        //             fine_amount: '1000',
        //             fine_branch: '13א',
        //             fine_driver: null,
        //             fine_status: '2',
        //             fine_street: 'העצמאות מול 3 מגדל העמק',
        //             fine_trx_id: null,
        //             fine_veh_id: vehicle.registration,
        //             fine_trx_msg: null,
        //             fine_comments: 'מבלי ששלמת אגרת הסדר חניה',
        //             fine_action_date: '2017-10-23 11:45:00',
        //             fine_end_cust_id: account.identifier,
        //             fine_import_date: '2020-01-26 17:04:00',
        //             fine_status_date: '2020-01-26 17:04:00',
        //             fine_verify_date: updatedApprovedDate,
        //             fine_amount_payed: null,
        //             fine_pay_due_date: '2018-03-13 00:00:00',
        //             fine_driver_charge: null,
        //             fine_transfer_date: null,
        //         };
        //
        //         const updatedRaw = await createRawInfringementService.createRawInfringement(updatedBody, client);
        //         const updatedNomination = updatedRaw.infringement.nomination;
        //
        //         expect(originalNomination).toBeTruthy();
        //         const originalDatesEqual = moment(originalApprovedDate).isSame(moment(originalNomination.approvedDate));
        //         expect(originalDatesEqual).toBeTruthy();
        //
        //         expect(updatedNomination).toBeTruthy();
        //         const updatedDatesEqual = moment(updatedApprovedDate).isSame(moment(updatedNomination.approvedDate));
        //         expect(updatedDatesEqual).toBeTruthy();
        //     }),
        // );
    });

    afterAll(async () => {
        const connection = getConnection();
        const entities = connection.entityMetadatas;

        for (const entity of entities) {
            const repository = await connection.getRepository(entity.name);
            await repository.query(`DELETE FROM "${entity.tableName}";`);
        }
        await TestApp.closeApp();
    });
});
