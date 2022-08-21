import { MigrationInterface, QueryRunner } from 'typeorm';

export class DBUpdate1571902171851 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_integration" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_integration" ADD CONSTRAINT "UQ_4d05f3e451863cf927550526207" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_integration" DROP CONSTRAINT "UQ_4d05f3e451863cf927550526207"`);
        await queryRunner.query(`ALTER TABLE "payment_integration" DROP COLUMN "name"`);
    }
}
