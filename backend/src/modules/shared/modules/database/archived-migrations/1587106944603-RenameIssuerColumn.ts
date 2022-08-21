import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameIssuerColumn1587106944603 implements MigrationInterface {
    name = 'RenameIssuerColumn1587106944603';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" RENAME COLUMN "details" TO "integrationDetails"`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" SET DEFAULT '{"type":"None"}'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" RENAME COLUMN "integrationDetails" TO "details"`, undefined);
    }
}
