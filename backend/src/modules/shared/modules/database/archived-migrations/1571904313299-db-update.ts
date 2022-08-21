import { MigrationInterface, QueryRunner } from 'typeorm';

export class dbUpdate1571904313299 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_integration" ADD "active" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_integration" DROP COLUMN "active"`);
    }
}
