import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountMetabaseReporting1594725465241 implements MigrationInterface {
    name = 'AccountMetabaseReporting1594725465241';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "accountMetabaseReporting" jsonb`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountMetabaseReporting"`, undefined);
    }
}
