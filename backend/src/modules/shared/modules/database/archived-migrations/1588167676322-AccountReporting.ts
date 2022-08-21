import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountReporting1588167676322 implements MigrationInterface {
    name = 'AccountReporting1588167676322';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" ADD "accountReporting" jsonb`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountReporting"`, undefined);
    }
}
