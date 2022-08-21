import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPaymentReferenceToThePaymentTable1609262193606 implements MigrationInterface {
    name = 'AddedPaymentReferenceToThePaymentTable1609262193606';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "externalReference" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "externalReference"`);
    }
}
