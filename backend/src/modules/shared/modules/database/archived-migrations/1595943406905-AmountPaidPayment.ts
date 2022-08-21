import { MigrationInterface, QueryRunner } from 'typeorm';

export class AmountPaidPayment1595943406905 implements MigrationInterface {
    name = 'AmountPaidPayment1595943406905';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "amountPaid" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amountPaid"`, undefined);
    }
}
