import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountPaymentMethods1582470196143 implements MigrationInterface {
    name = 'AccountPaymentMethods1582470196143';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" ADD "atgPayment" jsonb NOT NULL DEFAULT '{}'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "atgPayment"`, undefined);
    }
}
