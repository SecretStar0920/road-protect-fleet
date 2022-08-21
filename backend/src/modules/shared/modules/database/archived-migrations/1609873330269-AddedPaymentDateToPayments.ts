import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPaymentDateToPayments1609873330269 implements MigrationInterface {
    name = 'AddedPaymentDateToPayments1609873330269';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "paymentDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paymentDate"`);
    }
}
