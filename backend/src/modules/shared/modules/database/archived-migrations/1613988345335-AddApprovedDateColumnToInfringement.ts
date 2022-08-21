import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApprovedDateColumnToInfringement1613988345335 implements MigrationInterface {
    name = 'AddApprovedDateColumnToInfringement1613988345335';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" ADD "approvedDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_99205021d582249031e6527ff9" ON "infringement" ("approvedDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_99205021d582249031e6527ff9"`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "approvedDate"`);
    }
}
