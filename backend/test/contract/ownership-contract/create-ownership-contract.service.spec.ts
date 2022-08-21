import { INestApplication } from '@nestjs/common';
import { TestApp } from '../../helpers/test-app.singleton';
import { runInTransaction } from 'typeorm-test-transactions';
import { CreateLeaseContractDto } from '@modules/contract/modules/lease-contract/controllers/lease-contract.controller';
import { plainToClass } from 'class-transformer';
import { generator } from '@modules/shared/helpers/data-generators';
import { AccountRole } from '@entities';
import * as moment from 'moment';
import { CreateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract.service';
import { CreateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/controllers/create-ownership-contract.dto';

describe('Create Ownership Contract Service', () => {
    let app: INestApplication;
    let createOwnershipContractService: CreateOwnershipContractService;

    beforeAll(async () => {
        app = await TestApp.app();
        createOwnershipContractService = app.get(CreateOwnershipContractService);
    });

    describe('Update Ownership Contract Service', () => {
        it(
            'Should update an existing contract with metadata if the ownership contract already exists',
            runInTransaction(async () => {
                const startDate = moment().toISOString();
                const user = await generator.account({ role: AccountRole.User });
                const owner = await generator.account({ role: AccountRole.Owner });
                const vehicle = await generator.vehicle();
                const document = await generator.document({ fileDirectory: './tests' });

                const ownershipData: CreateOwnershipContractDto = plainToClass(CreateOwnershipContractDto, {
                    startDate,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                    document: document.documentId,
                } as CreateOwnershipContractDto);

                const ownershipContract = await createOwnershipContractService.upsertOwnershipContractAndLinkInfringements(ownershipData);

                expect(ownershipContract).toBeTruthy();
                expect(ownershipContract.status).toEqual('Valid');
                expect(ownershipContract.vehicle.registration).toEqual(vehicle.registration);
                expect(ownershipContract.document.fileName).toEqual(document.fileName);

                const document1 = await generator.document({ fileDirectory: './tests' });
                const reference = 'test-reference';

                const ownershipData1: CreateOwnershipContractDto = plainToClass(CreateOwnershipContractDto, {
                    startDate,
                    user: user.identifier,
                    owner: owner.identifier,
                    vehicle: vehicle.registration,
                    document: document1.documentId,
                    reference,
                });

                const ownershipContract1 = await createOwnershipContractService.upsertOwnershipContractAndLinkInfringements(ownershipData1);

                expect(ownershipContract1).toBeTruthy();
                expect(ownershipContract1.document.fileName).toEqual(document1.fileName);
                expect(ownershipContract1.reference).toEqual(reference);
                expect(ownershipContract1.contractId).toEqual(ownershipContract.contractId);
            }),
        );
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
