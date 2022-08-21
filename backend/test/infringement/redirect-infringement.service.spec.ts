import { fakeSocket, generator } from '@modules/shared/helpers/data-generators';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { INestApplication } from '@nestjs/common';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import * as moment from 'moment';
import * as faker from 'faker';
import * as fs from 'fs-extra';
import * as path from 'path';
import { plainToClass } from 'class-transformer';
import { AccountRole, DocumentTemplate, Infringement, LeaseContract, Nomination, NominationStatus, RedirectionType, User } from '@entities';
import { runInTransaction } from 'typeorm-test-transactions';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import { TestApp } from '../helpers/test-app.singleton';
import { MunicipallyRedirectNominationService } from '@modules/nomination/services/municipally-redirect-nomination.service';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { LinkDocumentService } from '@modules/document/services/link-document.service';
import { DocumentTemplateSeederService } from '@seeder/seeders/document-template-seeder.service';
import { isEmpty } from 'lodash';
import { CreateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract.service';
import { AutomaticNominationService } from '@modules/nomination/services/automatic-nomination.service';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { Logger } from '@logger';
import { waitForLogs } from '../helpers/wait-for-logs';

jest.setTimeout(3000000);

describe('Digital and Municipal Nominations and Redirections', () => {
    let app: INestApplication;
    let createInfringementService: CreateInfringementService;
    let createLeaseContractService: CreateLeaseContractService;
    let createOwnershipContractService: CreateOwnershipContractService;
    let municipallyRedirectNominationService: MunicipallyRedirectNominationService;
    let automaticNominationService: AutomaticNominationService;
    let createDocumentService: CreateDocumentService;
    let linkDocumentService: LinkDocumentService;
    let documentTemplateSeed: DocumentTemplateSeederService;

    beforeAll(async () => {
        app = await TestApp.app();
        createInfringementService = app.get(CreateInfringementService);
        createLeaseContractService = app.get(CreateLeaseContractService);
        municipallyRedirectNominationService = app.get(MunicipallyRedirectNominationService);
        createDocumentService = app.get(CreateDocumentService);
        linkDocumentService = app.get(LinkDocumentService);
        documentTemplateSeed = app.get(DocumentTemplateSeederService);
        createOwnershipContractService = app.get(CreateOwnershipContractService);
        automaticNominationService = app.get(AutomaticNominationService);
        if (isEmpty(await DocumentTemplate.find())) {
            await documentTemplateSeed.run();
        }
    });

    it(
        'Digitally nominates an infringement to another account on the system',
        runInTransaction(async () => {
            const vehicle = await generator.vehicle();

            const ownerAccount = await generator.account({ role: AccountRole.Owner });
            const userAccount = await generator.account({ role: AccountRole.User });
            const ownershipContract = await createOwnershipContractService.createOwnershipContractAndLinkInfringements({
                owner: ownerAccount.identifier,
                vehicle: vehicle.registration,
                startDate: moment().subtract(5, 'years').toISOString(),
                endDate: moment().add(5, 'years').toISOString(),
            });
            const leaseContract = await createLeaseContractService.createContractAndLinkInfringements({
                owner: ownerAccount.identifier,
                user: userAccount.identifier,
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
            });

            let infringement = await createInfringementService.createInfringement(infringementData);

            infringement = await Infringement.findWithMinimalRelations()
                .where('infringement.infringementId = :infringementId', {
                    infringementId: infringement.infringementId,
                })
                .getOne();
            infringement.contract = await LeaseContract.findWithMinimalRelations()
                .where('contract.contractId = :contractId', leaseContract)
                .getOne();

            await FeatureFlagHelper.createTestFeature('automated-digital-nominations');

            const statusUpdater = StatusUpdater.create()
                .setSource(StatusUpdateSources.UpdateInfringement)
                .setInitialInfringement(infringement)
                .setInitialNomination(infringement.nomination);

            await automaticNominationService.digitallyNominateByContract(infringement, statusUpdater);

            await statusUpdater.resolveStatusUpdates().persist();
            expect(infringement).toBeDefined();
            expect(infringement.nomination).toBeDefined();
            const nomination = await Nomination.findWithMinimalRelations()
                .where('nomination.nominationId = :nominationId', infringement.nomination)
                .getOne();

            expect(nomination.account.accountId).toEqual(userAccount.accountId);
        }),
    );

    // These tests have been commented out because the document api does not work as
    // expected on the testing deployment. For now, we're going to leave these as local
    // tests but we'll need to find a solution in future.
    //
    //
    // it(
    //     'Should manually redirect via email',
    //     runInTransaction(async () => {
    //         // Create vehicle
    //
    //         const vehicle = await generator.vehicle();
    //         // Create owner account
    //         const ownerPAFile = await fs.readFile(path.join(__dirname, '..', 'resources', 'owner_pa.pdf'));
    //         const ownerPADocument = await createDocumentService.saveDocumentFileAndCreate(
    //             {
    //                 fileName: 'owner_pa.pdf',
    //                 fileDirectory: null,
    //             },
    //             ownerPAFile,
    //         );
    //         const ownerAccount = await generator.account({
    //             name: 'OWNER ACCOUNT',
    //             role: AccountRole.Owner,
    //             powerOfAttorney: ownerPADocument,
    //         });
    //         // Create user account
    //
    //         const userAccount = await generator.account({ name: 'USER ACCOUNT', role: AccountRole.User });
    //         // Create a lease contract
    //         // Add the lease document
    //         const leaseFile = await fs.readFile(path.join(__dirname, '..', 'resources', 'lease.pdf'));
    //         const leaseDocument = await createDocumentService.saveDocumentFileAndCreate(
    //             {
    //                 fileName: 'lease.pdf',
    //                 fileDirectory: null,
    //             },
    //             leaseFile,
    //         );
    //         const contract = await createLeaseContractService.createContractAndLinkInfringements({
    //             owner: ownerAccount.identifier,
    //             user: userAccount.identifier,
    //             vehicle: vehicle.registration,
    //             startDate: moment().subtract(4, 'days').toISOString(),
    //             endDate: moment().add(4, 'days').toISOString(),
    //             document: leaseDocument.documentId,
    //         });
    //
    //         // Create infringement
    //         const issuer = await generator.issuer({ email: 'test@roadprotect.co.il' });
    //         const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
    //             noticeNumber: 'noticenumber14325',
    //             issuer: issuer.name,
    //             vehicle: vehicle.registration,
    //             amountDue: `${faker.random.number(1000)}`,
    //             originalAmount: `${faker.random.number(1000)}`,
    //             offenceDate: moment().toISOString(),
    //             streetName: faker.address.streetName(),
    //             streetNumber: `${faker.random.number(400)}`,
    //             country: 'South Africa',
    //         });
    //
    //         const infringement = await createInfringementService.createInfringement(infringementData);
    //
    //         // Intermediate checks
    //         // Check linked to correct contract
    //         expect(infringement.contract.contractId).toEqual(contract.contractId);
    //         // Check nominated to correct account
    //         expect(infringement.nomination).toBeTruthy();
    //         expect(infringement.nomination.account.accountId).toEqual(ownerAccount.accountId);
    //
    //         // Set nomination redirection document manually
    //         const redirectionFile = await fs.readFile(path.join(__dirname, '..', 'resources', 'redirection.pdf'));
    //         const redirectionDocument = await createDocumentService.saveDocumentFileAndCreate(
    //             {
    //                 fileName: 'redirection.pdf',
    //                 fileDirectory: null,
    //             },
    //             redirectionFile,
    //         );
    //         infringement.nomination.redirectionDocument = redirectionDocument;
    //         await infringement.nomination.save();
    //
    //         // Now redirection from owner to user
    //         try {
    //             const nomination = infringement.nomination;
    //             infringement.nomination = await municipallyRedirectNominationService.municipallyRedirectNomination(
    //                 nomination.nominationId,
    //                 ownerAccount.accountId,
    //                 await User.findOne(),
    //                 fakeSocket,
    //             );
    //
    //             expect(infringement.nomination.redirectionType).toEqual(RedirectionType.Manual);
    //             expect(infringement.nomination.status).toEqual(NominationStatus.InRedirectionProcess);
    //             expect(infringement.nomination.account.accountId).toEqual(userAccount.accountId);
    //             expect(infringement.nomination.redirectionTarget.accountId).toEqual(userAccount.accountId);
    //             expect(infringement.nomination.redirectedFrom.accountId).toEqual(ownerAccount.accountId);
    //         } catch (e) {
    //             Logger.instance.error({ message: 'Redirection failed', detail: e.message, fn: 'Test: Redirection' });
    //             expect(e).not.toBeTruthy();
    //         }
    //     }),
    // );

    // it(
    //     `Should manually redirect via email even if it's not nominated to the current account`,
    //     runInTransaction(async () => {
    //         // Create vehicle
    //
    //         const vehicle = await generator.vehicle();
    //         // Create owner account
    //         const ownerPAFile = await fs.readFile(path.join(__dirname, '..', 'resources', 'owner_pa.pdf'));
    //         const ownerPADocument = await createDocumentService.saveDocumentFileAndCreate(
    //             {
    //                 fileName: 'owner_pa.pdf',
    //                 fileDirectory: null,
    //             },
    //             ownerPAFile,
    //         );
    //         const ownerAccount = await generator.account({
    //             name: 'OWNER ACCOUNT',
    //             role: AccountRole.Owner,
    //             powerOfAttorney: ownerPADocument,
    //         });
    //         // Create user account
    //
    //         const userAccount = await generator.account({ name: 'USER ACCOUNT', role: AccountRole.User });
    //         // Create a lease contract
    //         // Add the lease document
    //         const leaseFile = await fs.readFile(path.join(__dirname, '..', 'resources', 'lease.pdf'));
    //         const leaseDocument = await createDocumentService.saveDocumentFileAndCreate(
    //             {
    //                 fileName: 'lease.pdf',
    //                 fileDirectory: null,
    //             },
    //             leaseFile,
    //         );
    //         const contract = await createLeaseContractService.createContractAndLinkInfringements({
    //             owner: ownerAccount.identifier,
    //             user: userAccount.identifier,
    //             vehicle: vehicle.registration,
    //             startDate: moment().subtract(4, 'days').toISOString(),
    //             endDate: moment().add(4, 'days').toISOString(),
    //             document: leaseDocument.documentId,
    //         });
    //
    //         // Create infringement
    //         const issuer = await generator.issuer({ email: 'test@roadprotect.co.il' });
    //         const infringementData: CreateInfringementDto = plainToClass(CreateInfringementDto, {
    //             noticeNumber: 'noticenumber14325',
    //             issuer: issuer.name,
    //             vehicle: vehicle.registration,
    //             amountDue: `${faker.random.number(1000)}`,
    //             originalAmount: `${faker.random.number(1000)}`,
    //             offenceDate: moment().toISOString(),
    //             streetName: faker.address.streetName(),
    //             streetNumber: `${faker.random.number(400)}`,
    //             country: 'South Africa',
    //         });
    //
    //         let infringement = await createInfringementService.createInfringement(infringementData);
    //
    //         infringement = await Infringement.findWithMinimalRelations()
    //             .where('infringement.infringementId = :infringementId', {
    //                 infringementId: infringement.infringementId,
    //             })
    //             .getOne();
    //         infringement.contract = await LeaseContract.findWithMinimalRelations()
    //             .where('contract.contractId = :contractId', contract)
    //             .getOne();
    //
    //         await FeatureFlagHelper.createTestFeature('automated-digital-nominations');
    //
    //         const statusUpdater = StatusUpdater.create()
    //             .setSource(StatusUpdateSources.UpdateInfringement)
    //             .setInitialInfringement(infringement)
    //             .setInitialNomination(infringement.nomination);
    //
    //         await automaticNominationService.digitallyNominateByContract(infringement, statusUpdater, {});
    //
    //         await statusUpdater.resolveStatusUpdates().persist();
    //         expect(infringement).toBeDefined();
    //         expect(infringement.nomination).toBeDefined();
    //         const nomination = await Nomination.findWithMinimalRelations()
    //             .where('nomination.nominationId = :nominationId', infringement.nomination)
    //             .getOne();
    //
    //         expect(nomination.account.accountId).toEqual(userAccount.accountId);
    //
    //         // Intermediate checks
    //         // Check linked to correct contract
    //         expect(infringement.contract.contractId).toEqual(contract.contractId);
    //         // Check nominated to correct account
    //         expect(infringement.nomination).toBeTruthy();
    //         expect(infringement.nomination.account.accountId).toEqual(ownerAccount.accountId);
    //
    //         // Set nomination redirection document manually
    //         const redirectionFile = await fs.readFile(path.join(__dirname, '..', 'resources', 'redirection.pdf'));
    //         const redirectionDocument = await createDocumentService.saveDocumentFileAndCreate(
    //             {
    //                 fileName: 'redirection.pdf',
    //                 fileDirectory: null,
    //             },
    //             redirectionFile,
    //         );
    //         infringement.nomination.redirectionDocument = redirectionDocument;
    //         await infringement.nomination.save();
    //
    //         // Now redirection from owner to user
    //         try {
    //             const nomination = infringement.nomination;
    //
    //             infringement.nomination = await municipallyRedirectNominationService.municipallyRedirectNomination(
    //                 nomination.nominationId,
    //                 ownerAccount.accountId,
    //                 await User.findOne(),
    //                 fakeSocket,
    //             );
    //
    //             expect(infringement.nomination.redirectionType).toBe(RedirectionType.Manual);
    //             expect(infringement.nomination.status).toBe(NominationStatus.InRedirectionProcess);
    //             expect(infringement.nomination.account.accountId).toBe(userAccount.accountId);
    //             expect(infringement.nomination.redirectionTarget.accountId).toBe(userAccount.accountId);
    //             expect(infringement.nomination.redirectedFrom.accountId).toBe(ownerAccount.accountId);
    //         } catch (e) {
    //             Logger.instance.error({ message: 'Redirection failed', detail: e.message, fn: 'Test: Redirection' });
    //             expect(e).not.toBeTruthy();
    //         }
    //     }),
    // );

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
