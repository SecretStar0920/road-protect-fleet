import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountDetailsColumn1573810670932 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" ADD "details" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "details" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "details" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "details"`);
    }
}
