import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamedToReferenceId1578383477531 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" RENAME COLUMN "temporaryDocumentName" TO "referenceId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" RENAME COLUMN "referenceId" TO "temporaryDocumentName"`);
    }
}
