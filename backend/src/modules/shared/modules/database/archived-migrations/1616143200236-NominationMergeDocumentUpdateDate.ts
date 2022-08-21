import { MigrationInterface, QueryRunner } from 'typeorm';

export class NominationMergeDocumentUpdateDate1616143200236 implements MigrationInterface {
    name = 'NominationMergeDocumentUpdateDate1616143200236';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nomination" ADD "mergedDocumentUpdatedDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_5338fbedd05a1b4e549aa705e8" ON "nomination" ("mergedDocumentUpdatedDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_5338fbedd05a1b4e549aa705e8"`);
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "mergedDocumentUpdatedDate"`);
    }
}
