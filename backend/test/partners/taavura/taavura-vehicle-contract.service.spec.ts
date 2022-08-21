import { BadRequestException, INestApplication } from '@nestjs/common';
import { runInTransaction } from 'typeorm-test-transactions';
import { TestApp } from '../../helpers/test-app.singleton';
import { AccountRole, LeaseContract, OwnershipContract, Vehicle } from '@entities';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import { CreateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract.service';
import {
    TaavuraContractReferencePrefix,
    TaavuraVehicleContractService,
} from '@modules/partners/modules/taavura/services/taavura-vehicle-contract.service';
import {
    TaavuraVehicleContractDto,
    VehicleContractIntent,
} from '@modules/partners/modules/taavura/controllers/taavura-vehicle-contract.dto';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import * as moment from 'moment';
import { generator } from '@modules/shared/helpers/data-generators';

describe('Taavura Vehicle Contract', () => {
    let app: INestApplication;
    let taavuraService: TaavuraVehicleContractService;
    const taavuraAccountDetails = {
        identifier: '512562422',
        name: 'תעבורה אחזקות בע"מ',
        primaryContact: 'aril@tashtit.co.il',
        active: true,
        isVerified: false,
        role: AccountRole.Hybrid,
    };

    let createLeaseContractService: CreateLeaseContractService;
    let createOwnershipContractService: CreateOwnershipContractService;

    beforeAll(async () => {
        app = await TestApp.app();
        taavuraService = app.get(TaavuraVehicleContractService);
        createLeaseContractService = app.get(CreateLeaseContractService);
        createOwnershipContractService = app.get(CreateOwnershipContractService);
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });

    it(
        'Determine correct intent',
        runInTransaction(async () => {
            const minimalLeaseRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: '65992101',
                veh_vendor: 'DAF',
                veh_owner_id: '512562422',
                veh_end_cust_id: '510953904',
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: '13176',
            });
            const leaseValidations = await taavuraService.validateIntentions(minimalLeaseRequest);
            const leaseIntent = await taavuraService.determineIntention(leaseValidations, minimalLeaseRequest);
            expect(leaseIntent).toEqual(VehicleContractIntent.VehicleLease);

            const minimalOwnerRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: '65992101',
                veh_vendor: 'DAF',
                veh_owner_id: '512562422',
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: '12629',
            });
            const ownerValidations = await taavuraService.validateIntentions(minimalOwnerRequest);
            const ownerIntent = await taavuraService.determineIntention(ownerValidations, minimalOwnerRequest);
            expect(ownerIntent).toEqual(VehicleContractIntent.VehicleOwnership);

            const combinedRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: '65992101',
                veh_vendor: 'DAF',
                veh_model: 'FA LF210H12',
                veh_year: '2017',
                veh_color: 'H3279WHTE',
                veh_category: 'light truck 5-10-15',
                veh_weight: 2500,
                veh_owner_id: '512562422',
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: '12629',
                veh_end_cust_id: '510953904',
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: '13176',
            });
            const combinedValidations = await taavuraService.validateIntentions(combinedRequest);
            const combinedIntent = await taavuraService.determineIntention(combinedValidations, combinedRequest);
            expect(combinedIntent).toEqual(VehicleContractIntent.VehicleLeaseAndOwnership);

            const combinedRequestWithSameBRN: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: '65992101',
                veh_vendor: 'DAF',
                veh_model: 'FA LF210H12',
                veh_year: '2017',
                veh_color: 'H3279WHTE',
                veh_category: 'light truck 5-10-15',
                veh_weight: 2500,
                veh_owner_id: '512562422',
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: '12629',
                veh_end_cust_id: '512562422',
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: '13176',
            });
            const combinedSameBRNValidations = await taavuraService.validateIntentions(combinedRequestWithSameBRN);
            const combinedSameBRNIntent = await taavuraService.determineIntention(combinedSameBRNValidations, combinedRequestWithSameBRN);
            expect(combinedSameBRNIntent).toEqual(VehicleContractIntent.VehicleOwnershipReturn);
        }),
    );

    it(
        'No existing vehicle or ownership details',
        runInTransaction(async () => {
            // GIVEN
            // Owner account exists
            const ownerAccount = await generator.account(taavuraAccountDetails);
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and ownership details
            const minimalOwnerRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: faker.random.alphaNumeric(8),
                veh_vendor: faker.commerce.productName(),
                veh_owner_id: ownerAccount.identifier,
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: faker.random.number(10000),
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(minimalOwnerRequest);
            // THEN
            // Vehicle created
            expect(result.data.vehicle).toBeTruthy();
            expect(await Vehicle.findOneByRegistrationOrId(minimalOwnerRequest.veh_id)).toBeTruthy();
            // Ownership created
            expect(result.data.ownership).toBeTruthy();
            expect(await OwnershipContract.findByIds([result.data.ownership.contractId])).toBeTruthy();
            expect(moment(result.data.ownership.startDate).isSame(moment('2020-05-10'), 'day')).toBeTruthy();
            expect(moment(result.data.ownership.endDate).isSame(moment('2026-12-31'), 'day')).toBeTruthy();
            // Lease not created
            expect(result.data.lease).toBeNull();
        }),
    );

    it(
        'No existing vehicle or lease',
        runInTransaction(async () => {
            // GIVEN
            // Owner account exists
            const ownerAccount = await generator.account(taavuraAccountDetails);
            // and User account exists
            const userAccount = await generator.account({ role: AccountRole.User });
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and user details
            const minimalLeaseRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: faker.random.alphaNumeric(8),
                veh_vendor: faker.commerce.productName(),
                veh_owner_id: ownerAccount.identifier,
                veh_end_cust_id: userAccount.identifier,
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: faker.random.number(10000),
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(minimalLeaseRequest);
            // THEN
            // Vehicle created
            expect(result.data.vehicle).toBeTruthy();
            expect(await Vehicle.findOneByRegistrationOrId(minimalLeaseRequest.veh_id)).toBeTruthy();
            // Lease created
            expect(result.data.lease).toBeTruthy();
            expect(await OwnershipContract.findByIds([result.data.lease.contractId])).toBeTruthy();
            expect(moment(result.data.lease.startDate).isSame(moment('2020-05-17'), 'day')).toBeTruthy();
            expect(moment(result.data.lease.endDate).isSame(moment('2027-05-16'), 'day')).toBeTruthy();
            // Ownership not created
            expect(result.data.ownership).toBeNull();
        }),
    );

    it(
        'No existing vehicle, lease or ownership details',
        runInTransaction(async () => {
            // GIVEN
            // Owner account exists
            const ownerAccount = await generator.account(taavuraAccountDetails);
            // and User account exists
            const userAccount = await generator.account({ role: AccountRole.User });
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and user details
            // and owner details
            const combinedRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: faker.random.alphaNumeric(8),
                veh_vendor: faker.commerce.productName(),
                veh_model: 'FA LF210H12',
                veh_year: '2017',
                veh_color: 'H3279WHTE',
                veh_category: 'light truck 5-10-15',
                veh_weight: 2500,
                veh_owner_id: ownerAccount.identifier,
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: faker.random.number(10000),
                veh_end_cust_id: userAccount.identifier,
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: faker.random.number(10000),
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(combinedRequest);
            // THEN
            // Vehicle created
            expect(result.data.vehicle).toBeTruthy();
            expect(await Vehicle.findOneByRegistrationOrId(combinedRequest.veh_id)).toBeTruthy();
            // Lease created
            expect(result.data.lease).toBeTruthy();
            expect(await OwnershipContract.findByIds([result.data.lease.contractId])).toBeTruthy();
            expect(moment(result.data.lease.startDate).isSame(moment('2020-05-17'), 'day')).toBeTruthy();
            expect(moment(result.data.lease.endDate).isSame(moment('2027-05-16'), 'day')).toBeTruthy();
            // Ownership created
            expect(result.data.ownership).toBeTruthy();
            expect(await OwnershipContract.findByIds([result.data.ownership.contractId])).toBeTruthy();
            expect(moment(result.data.ownership.startDate).isSame(moment('2020-05-10'), 'day')).toBeTruthy();
            expect(moment(result.data.ownership.endDate).isSame(moment('2026-12-31'), 'day')).toBeTruthy();
        }),
    );

    it(
        'No existing account/customer',
        runInTransaction(async () => {
            // GIVEN
            // Owner / User account does not exist
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and user details
            // and owner details
            const combinedRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: faker.random.alphaNumeric(8),
                veh_vendor: faker.commerce.productName(),
                veh_model: 'FA LF210H12',
                veh_year: '2017',
                veh_color: 'H3279WHTE',
                veh_category: 'light truck 5-10-15',
                veh_weight: 2500,
                veh_owner_id: faker.random.alphaNumeric(6),
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: faker.random.number(10000),
                veh_end_cust_id: faker.random.alphaNumeric(6),
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: faker.random.number(10000),
            });
            try {
                const result = await taavuraService.vehicleContractCreateOrUpdate(combinedRequest);
            } catch (e) {
                // THEN
                // An error is returned stating that their customer does not exist in the system. The customer must be created first via account WS
                expect(e instanceof BadRequestException).toBeTruthy();
            }
        }),
    );

    it(
        'Existing vehicle with no contracts',
        runInTransaction(async () => {
            // GIVEN
            // Vehicle exists
            const vehicle = await generator.vehicle();
            // Owner account exists
            const ownerAccount = await generator.account(taavuraAccountDetails);
            // and User account exists
            const userAccount = await generator.account({ role: AccountRole.User });
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and user details
            // and owner details
            const combinedRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: vehicle.registration,
                veh_vendor: vehicle.manufacturer,
                veh_model: 'UPDATED MODEL',
                veh_owner_id: ownerAccount.identifier,
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: faker.random.number(10000),
                veh_end_cust_id: userAccount.identifier,
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: faker.random.number(10000),
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(combinedRequest);
            // THEN
            // Vehicle update
            expect(result.data.vehicle).toBeTruthy();
            expect(result.data.vehicle.vehicleId).toEqual(vehicle.vehicleId);
            await vehicle.reload();
            expect(vehicle.model).toEqual('UPDATED MODEL');
            // Lease created
            expect(result.data.lease).toBeTruthy();
            expect(await OwnershipContract.findByIds([result.data.lease.contractId])).toBeTruthy();
            expect(moment(result.data.lease.startDate).isSame(moment('2020-05-17'), 'day')).toBeTruthy();
            expect(moment(result.data.lease.endDate).isSame(moment('2027-05-16'), 'day')).toBeTruthy();
            // Ownership created
            expect(result.data.ownership).toBeTruthy();
            expect(await OwnershipContract.findByIds([result.data.ownership.contractId])).toBeTruthy();
            expect(moment(result.data.ownership.startDate).isSame(moment('2020-05-10'), 'day')).toBeTruthy();
            expect(moment(result.data.ownership.endDate).isSame(moment('2026-12-31'), 'day')).toBeTruthy();
        }),
    );

    it(
        'Existing vehicle and ownership (valid Taavura Ids that are equal)',
        runInTransaction(async () => {
            // GIVEN
            // Vehicle exists
            const vehicle = await generator.vehicle();
            // Owner account exists
            const ownerAccount = await generator.account(taavuraAccountDetails);
            // Ownership detail exists with Taavura ID ‘1’
            const ownershipContract = await generator.ownershipContract({
                owner: ownerAccount,
                reference: TaavuraContractReferencePrefix.Ownership + '1',
                vehicle,
            });
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and ownership details
            // with Taavura ID `1`
            const minimalOwnerRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: faker.random.alphaNumeric(8),
                veh_vendor: faker.commerce.productName(),
                veh_owner_id: ownerAccount.identifier,
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: 1,
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(minimalOwnerRequest);
            // THEN
            // Vehicle created
            expect(result.data.vehicle).toBeTruthy();
            expect(await Vehicle.findOneByRegistrationOrId(minimalOwnerRequest.veh_id)).toBeTruthy();
            // Ownership `1` updated / replaced
            const ownershipContractsFound = await OwnershipContract.findByReference(
                TaavuraContractReferencePrefix.Ownership + '1',
            ).getMany();
            expect(ownershipContractsFound.length).toEqual(1);
            expect(moment(ownershipContractsFound[0].startDate).isSame(moment('2020-05-10'), 'day')).toBeTruthy();
            expect(moment(ownershipContractsFound[0].endDate).isSame(moment('2026-12-31'), 'day')).toBeTruthy();
        }),
    );

    it(
        'Existing vehicle and lease (valid Taavura Ids that are equal)',
        runInTransaction(async () => {
            // GIVEN
            // Vehicle exists
            const vehicle = await generator.vehicle();
            // Owner account exists
            const ownerAccount = await generator.account(taavuraAccountDetails);
            // User account exists
            const userAccount = await generator.account({ role: AccountRole.User });
            // Ownership detail exists with Taavura ID ‘1’
            const leaseContract = await generator.leaseContract({
                owner: ownerAccount,
                user: userAccount,
                reference: TaavuraContractReferencePrefix.Lease + '1',
                vehicle,
            });
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and lease details
            // with Taavura ID `1`
            const minimalLeaseRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: faker.random.alphaNumeric(8),
                veh_vendor: faker.commerce.productName(),
                veh_owner_id: ownerAccount.identifier,
                veh_end_cust_id: userAccount.identifier,
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: 1,
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(minimalLeaseRequest);
            // THEN
            // Vehicle created
            expect(result.data.vehicle).toBeTruthy();
            expect(await Vehicle.findOneByRegistrationOrId(minimalLeaseRequest.veh_id)).toBeTruthy();
            // Lease `1` updated / replaced
            const leaseContractsFound = await LeaseContract.findByReference(TaavuraContractReferencePrefix.Lease + '1').getMany();
            expect(leaseContractsFound.length).toEqual(1);
            expect(moment(leaseContractsFound[0].startDate).isSame(moment('2020-05-17'), 'day')).toBeTruthy();
            expect(moment(leaseContractsFound[0].endDate).isSame(moment('2027-05-16'), 'day')).toBeTruthy();
        }),
    );

    it(
        'Existing vehicle and ownership (valid Taavura Ids that are not equal and are overlapping)',
        runInTransaction(async () => {
            // GIVEN
            // Vehicle exists
            const vehicle = await generator.vehicle();
            // Owner account exists
            const ownerAccount = await generator.account(taavuraAccountDetails);
            // Ownership detail exists with Taavura ID ‘1’
            const ownershipContract = await generator.ownershipContract({
                owner: ownerAccount,
                reference: TaavuraContractReferencePrefix.Ownership + '1',
                vehicle,
                startDate: moment('2020-05-01').toISOString(),
                endDate: moment('2020-05-13').toISOString(),
            });
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and ownership details
            // with Taavura ID `1`
            const minimalOwnerRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: vehicle.registration,
                veh_vendor: vehicle.manufacturer,
                veh_owner_id: ownerAccount.identifier,
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: 2,
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(minimalOwnerRequest);
            // THEN
            // Vehicle created
            expect(result.data.vehicle).toBeTruthy();
            expect(await Vehicle.findOneByRegistrationOrId(minimalOwnerRequest.veh_id)).toBeTruthy();
            // Ownership `2` created
            expect(result.data.ownership).toBeTruthy();
            expect(await OwnershipContract.findByIds([result.data.ownership.contractId])).toBeTruthy();
            expect(moment(result.data.ownership.startDate).isSame(moment('2020-05-10'), 'day')).toBeTruthy();
            expect(moment(result.data.ownership.endDate).isSame(moment('2026-12-31'), 'day')).toBeTruthy();
            // Ownership `1` still exists
            const originalContract = await OwnershipContract.findOne(ownershipContract.contractId);
            expect(originalContract).toBeTruthy();
            // Date overlap reduces overlapping contract to end when the new one begins
            expect(moment(originalContract.endDate).diff(moment(result.data.ownership.startDate), 'seconds')).toEqual(-1);
        }),
    );

    it(
        'Existing vehicle and lease (valid Taavura Ids that are not equal and are overlapping)',
        runInTransaction(async () => {
            // GIVEN
            // Vehicle exists
            const vehicle = await generator.vehicle();
            // Owner account exists
            const ownerAccount = await generator.account(taavuraAccountDetails);
            // User account exists
            const userAccount = await generator.account({ role: AccountRole.User });
            // Ownership detail exists with Taavura ID ‘1’
            const leaseContract = await generator.leaseContract({
                owner: ownerAccount,
                user: userAccount,
                reference: TaavuraContractReferencePrefix.Lease + '1',
                vehicle,
                startDate: moment('2020-05-01').toISOString(),
                endDate: moment('2020-05-13').toISOString(),
            });
            // WHEN
            // A valid vehicle-contract request
            // with vehicle details
            // and lease details
            // with Taavura ID `2`
            const minimalLeaseRequest: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: vehicle.registration,
                veh_vendor: vehicle.manufacturer,
                veh_owner_id: ownerAccount.identifier,
                veh_end_cust_id: userAccount.identifier,
                veh_end_cust_start: '2020-05-10',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: 2,
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(minimalLeaseRequest);
            // THEN
            // Vehicle created
            expect(result.data.vehicle).toBeTruthy();
            expect(await Vehicle.findOneByRegistrationOrId(minimalLeaseRequest.veh_id)).toBeTruthy();
            // Lease `2` created
            expect(result.data.lease).toBeTruthy();
            expect(await LeaseContract.findByIds([result.data.lease.contractId])).toBeTruthy();
            expect(moment(result.data.lease.startDate).isSame(moment('2020-05-10'), 'day')).toBeTruthy();
            expect(moment(result.data.lease.endDate).isSame(moment('2027-05-16'), 'day')).toBeTruthy();
            // Lease `1` still exists
            const originalContract = await LeaseContract.findOne(leaseContract.contractId);
            expect(originalContract).toBeTruthy();
            // Date overlap reduces overlapping contract to end when the new one begins
            expect(moment(originalContract.endDate).diff(moment(result.data.lease.startDate), 'seconds')).toEqual(-1);
        }),
    );

    it(
        'Same User & Owner BRNs provided',
        runInTransaction(async () => {
            // GIVEN
            // Vehicle exists
            const vehicle = await generator.vehicle();
            // Owner account exists
            const taavuraAccount = await generator.account(taavuraAccountDetails);
            const randomAccount = await generator.account();
            // WHEN
            // A valid vehicle-contract request
            // With veh_owner_id equal to veh_cust_end_id
            const request: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: vehicle.registration,
                veh_vendor: vehicle.manufacturer,
                veh_model: 'UPDATED MODEL',
                veh_owner_id: taavuraAccount.identifier,
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: faker.random.number(10000),
                veh_end_cust_id: taavuraAccount.identifier,
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: faker.random.number(10000),
            });
            const result = await taavuraService.vehicleContractCreateOrUpdate(request);
            // THEN
            // Vehicle updated
            expect(result.data.vehicle).toBeTruthy();
            expect(result.data.vehicle.vehicleId).toEqual(vehicle.vehicleId);
            await vehicle.reload();
            expect(vehicle.model).toEqual('UPDATED MODEL');
            // Lease NOT created
            expect(result.data.lease).toBeFalsy();
            // Ownership NOT created
            expect(result.data.ownership).toBeFalsy();
            // expect(await OwnershipContract.findByIds([result.data.ownership.contractId])).toBeTruthy();
            // expect(moment(result.data.ownership.startDate).isSame(moment('2020-05-10'), 'day')).toBeTruthy();
            // expect(moment(result.data.ownership.endDate).isSame(moment('2026-12-31'), 'day')).toBeTruthy();

            // Throws an error if dtos are the same and not Taavuras
            const requestThrow: TaavuraVehicleContractDto = plainToClass(TaavuraVehicleContractDto, {
                veh_id: vehicle.registration,
                veh_vendor: vehicle.manufacturer,
                veh_model: 'UPDATED MODEL',
                veh_owner_id: randomAccount.identifier,
                veh_owner_start: '2020-05-10',
                veh_owner_end: '2026-12-31',
                owner_update_id: faker.random.number(10000),
                veh_end_cust_id: randomAccount.identifier,
                veh_end_cust_start: '2020-05-17',
                veh_end_cust_end: '2027-05-16',
                contract_update_id: faker.random.number(10000),
            });
            try {
                await taavuraService.vehicleContractCreateOrUpdate(requestThrow);
            } catch (e) {
                expect(e).toBeTruthy();
            }
        }),
    );
});
