import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntegrationPaymentStatus1571904873816 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "payment_status_enum" AS ENUM('Pending', 'Successful', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "status" "payment_status_enum"`);
        await queryRunner.query(`CREATE TYPE "integration_payment_status_enum" AS ENUM('Pending', 'Successful', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "integration_payment" ADD "status" "integration_payment_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "integration_payment" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "integration_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "payment_status_enum"`);
    }
}
