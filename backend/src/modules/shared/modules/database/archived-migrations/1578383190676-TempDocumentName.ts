import { MigrationInterface, QueryRunner } from 'typeorm';

export class TempDocumentName1578383190676 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" ADD "temporaryDocumentName" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "temporaryDocumentName"`);
    }
}
