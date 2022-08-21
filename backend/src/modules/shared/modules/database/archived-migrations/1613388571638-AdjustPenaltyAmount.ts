import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdjustPenaltyAmount1613388571638 implements MigrationInterface {
    name = 'AdjustPenaltyAmount1613388571638';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" ADD "penaltyAmount" numeric(12,2)`);
        await queryRunner.query(`CREATE INDEX "IDX_f6f2702b9886b6b0fc99378e1f" ON "infringement" ("penaltyAmount") `);
        await queryRunner.query(
            ` UPDATE infringement SET "penaltyAmount" = "calcPenaltyAmount" FROM (select "infringementId", case when "totalPayments" is not null and "totalPayments" >0 then "amountDue" + "totalPayments"  - "originalAmount" when "amountDue" - "originalAmount"<0 then "amountDue" else "amountDue" - "originalAmount" end as "calcPenaltyAmount" from infringement) Calc WHERE infringement."infringementId" = Calc."infringementId" `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_f6f2702b9886b6b0fc99378e1f"`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "penaltyAmount"`);
    }
}
