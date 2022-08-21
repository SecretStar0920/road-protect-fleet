import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentInfringementRelationshipUpdate1613035664107 implements MigrationInterface {
    name = 'PaymentInfringementRelationshipUpdate1613035664107';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" ADD "totalPayments" numeric(12,2)`);
        await queryRunner.query(`CREATE INDEX "IDX_d8989db208ab5f1e1ae6c3a302" ON "infringement" ("totalPayments") `);
        await queryRunner.query(
            `UPDATE infringement SET "totalPayments" = "totalPaid" FROM (SELECT "infringementId", coalesce(SUM(CAST((REPLACE ("amountPaid", ',', '')) AS DECIMAL(10,2))),cast(0 AS DECIMAL(10,2))) AS "totalPaid" FROM payment GROUP BY "infringementId") Grouped WHERE infringement."infringementId" = Grouped."infringementId"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_d8989db208ab5f1e1ae6c3a302"`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "totalPayments"`);
    }
}
