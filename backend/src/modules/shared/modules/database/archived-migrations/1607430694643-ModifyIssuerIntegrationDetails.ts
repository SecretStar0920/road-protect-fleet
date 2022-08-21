import { InfringementVerificationProvider } from '@config/infringement';
import {
    ATGIssuerIntegrationDetails,
    IssuerIntegrationType,
    JerusalemIssuerIntegrationDetails,
    MetroparkIssuerIntegrationDetails,
    MileonIssuerIntegrationDetails,
    TelavivIssuerIntegrationDetails,
} from '@modules/shared/models/issuer-integration-details.model';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyIssuerIntegrationDetails1607430694643 implements MigrationInterface {
    name = 'ModifyIssuerIntegrationDetails1607430694643';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const jerusalemIntegrationDetails: JerusalemIssuerIntegrationDetails = {
            type: IssuerIntegrationType.Jerusalem,
            verificationProvider: InfringementVerificationProvider.Jerusalem,
        };
        await queryRunner.query(
            `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(jerusalemIntegrationDetails)}' WHERE code = '3000'`,
        );

        const telavivIntegrationDetails: TelavivIssuerIntegrationDetails = {
            type: IssuerIntegrationType.Telaviv,
            verificationProvider: InfringementVerificationProvider.Telaviv,
        };
        await queryRunner.query(
            `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(telavivIntegrationDetails)}' WHERE code = '5000'`,
        );

        const mileonIntegrationDetails: MileonIssuerIntegrationDetails = {
            type: IssuerIntegrationType.Mileon,
            verificationProvider: InfringementVerificationProvider.Mileon,
            code: '',
            name: '',
        };
        await queryRunner.query(
            `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(mileonIntegrationDetails)}' WHERE provider = 'mil’on'`,
        );

        const metroparkIntegrationDetails: MetroparkIssuerIntegrationDetails = {
            type: IssuerIntegrationType.Metropark,
            verificationProvider: InfringementVerificationProvider.Metropark,
            code: '',
            name: '',
        };
        await queryRunner.query(
            `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(metroparkIntegrationDetails)}' WHERE provider = 'metropark'`,
        );

        const atgIssuers = await queryRunner.query(`SELECT * FROM issuer WHERE "provider" = 'ATG'`);
        for (const atgIssuer of atgIssuers) {
            const atgIntegrationDetails: ATGIssuerIntegrationDetails = {
                ...atgIssuer.integrationDetails,
                type: IssuerIntegrationType.ATG,
                verificationProvider: InfringementVerificationProvider.ATG,
            };
            await queryRunner.query(
                `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(atgIntegrationDetails)}' WHERE "issuerId"=${
                    atgIssuer.issuerId
                }`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const jerusalemIntegrationDetails = '{}';
        await queryRunner.query(`UPDATE issuer SET "integrationDetails" = '${jerusalemIntegrationDetails}' WHERE code = '3000'`);

        const telavivIntegrationDetails = '{}';
        await queryRunner.query(`UPDATE issuer SET "integrationDetails" = '${telavivIntegrationDetails}' WHERE code = '5000'`);

        const mileonIntegrationDetails = '{}';
        await queryRunner.query(`UPDATE issuer SET "integrationDetails" = '${mileonIntegrationDetails}' WHERE provider = 'mil’on'`);

        const atgIssuers = await queryRunner.query(`SELECT * FROM issuer WHERE "integrationDetails"->>'type' = 'ATG'`);
        for (const atgIssuer of atgIssuers) {
            const atgIntegrationDetails: ATGIssuerIntegrationDetails = atgIssuer.integrationDetails;
            delete atgIntegrationDetails.verificationProvider;
            await queryRunner.query(
                `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(atgIntegrationDetails)}' WHERE "issuerId"=${
                    atgIssuer.issuerId
                }`,
            );
        }
    }
}
