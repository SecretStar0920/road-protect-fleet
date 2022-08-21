import { MigrationInterface, QueryRunner } from 'typeorm';

export class DBUpdate1571902552542 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_integration" ADD "production" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_integration" ADD "sandbox" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_integration" DROP COLUMN "sandbox"`);
        await queryRunner.query(`ALTER TABLE "payment_integration" DROP COLUMN "production"`);
    }
}
