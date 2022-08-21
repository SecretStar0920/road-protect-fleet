import { INestApplication } from '@nestjs/common';
import { runInTransaction } from 'typeorm-test-transactions';
import { TestApp } from '../helpers/test-app.singleton';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { generator } from '@modules/shared/helpers/data-generators';
import { plainToClass } from 'class-transformer';
import { ATGIssuerIntegrationDetails } from '@modules/shared/models/issuer-integration-details.model';

describe('ATG Issuer Integrations', () => {
    let app: INestApplication;
    const issuersAutomationIntegration: AtgIssuers = new AtgIssuers();

    beforeAll(async () => {
        app = await TestApp.app();
    });

    describe('ATG Issuer Integrations', () => {
        it(
            'Should map atg code to issuer code via query',
            runInTransaction(async () => {
                const issuerWithAtgDetails = await generator.issuer({
                    integrationDetails: plainToClass(ATGIssuerIntegrationDetails, { code: '1234', isPCI: 1 }),
                });
                const issuerCode = await issuersAutomationIntegration.getIssuerCodeByATGCode('1234');
                const atgCode = await issuersAutomationIntegration.getATGCodeByIssuerCode(issuerWithAtgDetails.code);

                expect(issuerCode).toEqual(issuerWithAtgDetails.code);
                expect(atgCode).toEqual('1234');
            }),
        );

        it(
            'Should check whether an issuer is ATG via query',
            runInTransaction(async () => {
                const issuerA = await generator.issuer({
                    integrationDetails: plainToClass(ATGIssuerIntegrationDetails, { code: '1234', isPCI: 1 }),
                    provider: 'ATG',
                });
                const issuerB = await generator.issuer();
                const isIssuerAAtg = await issuersAutomationIntegration.isATGIssuer(issuerA.issuerId);
                const isIssuerBAtg = await issuersAutomationIntegration.isATGIssuer(issuerB.issuerId);

                expect(isIssuerAAtg).toBeTruthy();
                expect(isIssuerBAtg).toBeFalsy();
            }),
        );

        it(
            'Should check whether an issuer is PCI',
            runInTransaction(async () => {
                const issuerA = await generator.issuer({
                    integrationDetails: plainToClass(ATGIssuerIntegrationDetails, { code: '1234', isPCI: 1 }),
                    provider: 'ATG',
                });
                const issuerB = await generator.issuer();
                const issuerC = await generator.issuer({
                    integrationDetails: plainToClass(ATGIssuerIntegrationDetails, { code: '2234', isPCI: 0 }),
                    provider: 'ATG',
                });
                const isIssuerAPCI = await issuersAutomationIntegration.isPCICompliant(issuerA.issuerId);
                const isIssuerBPCI = await issuersAutomationIntegration.isPCICompliant(issuerB.issuerId);
                const isIssuerCPCI = await issuersAutomationIntegration.isPCICompliant(issuerB.issuerId);

                expect(isIssuerAPCI).toBeTruthy();
                expect(isIssuerBPCI).toBeFalsy();
                expect(isIssuerCPCI).toBeFalsy();
            }),
        );
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
