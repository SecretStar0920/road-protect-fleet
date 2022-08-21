import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedInfringementTotalAmountField1603959169476 implements MigrationInterface {
    name = 'AddedInfringementTotalAmountField1603959169476';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" ADD "totalAmount" numeric(12,2)`);
        await queryRunner.query(`CREATE INDEX "IDX_36315e8528d6d23badb8e988bf" ON "infringement" ("totalAmount") `);

        // Run update to set total amount to amount due or original (whichever greatest)
        await queryRunner.query(`UPDATE infringement SET "totalAmount" = greatest("amountDue", "originalAmount")`);

        // Set constraint to not null
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "totalAmount" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_36315e8528d6d23badb8e988bf"`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "totalAmount"`);
    }
}
