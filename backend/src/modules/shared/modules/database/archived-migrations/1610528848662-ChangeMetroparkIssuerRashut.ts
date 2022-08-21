import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMetroparkIssuerRashut1610528848662 implements MigrationInterface {
    name = 'ChangeMetroparkIssuerRashut1610528848662';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const metroparkIssuers = await queryRunner.query(`SELECT * FROM issuer WHERE name = 'מועצה אזורית חבל מודיעין'`);
        if (!metroparkIssuers || metroparkIssuers.length === 0) {
            throw new Error('Issuer not found');
        }

        const metroparkIssuer = metroparkIssuers[0];
        const externalCode = '58';
        if (externalCode) {
            const integrationDetails = {
                ...metroparkIssuer.integrationDetails,
                code: externalCode,
            };
            await queryRunner.query(
                `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(integrationDetails)}' WHERE "issuerId"=${
                    metroparkIssuer.issuerId
                }`,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
