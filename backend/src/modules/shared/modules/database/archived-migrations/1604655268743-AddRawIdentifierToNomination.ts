import { MigrationInterface, QueryRunner } from 'typeorm';
import { Config } from '@config/config';

export class AddRawIdentifierToNomination1604655268743 implements MigrationInterface {
    name = 'AddRawIdentifierToNomination1604655268743';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nomination" ADD "rawRedirectionIdentifier" character varying`);
        await queryRunner.query(`CREATE INDEX "nomination_raw_redirection_identifier_idx" ON "nomination" ("rawRedirectionIdentifier") `);
        await queryRunner.query(`INSERT INTO "client" (name) VALUES ('${Config.get.infringement.infringementUploadClientName}')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "client" WHERE name='${Config.get.infringement.infringementUploadClientName}'`);
        await queryRunner.query(`DROP INDEX "nomination_raw_redirection_identifier_idx"`);
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "rawRedirectionIdentifier"`);
    }
}
