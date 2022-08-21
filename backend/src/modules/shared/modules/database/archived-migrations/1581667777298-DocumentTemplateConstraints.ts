import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentTemplateConstraints1581667777298 implements MigrationInterface {
    name = 'DocumentTemplateConstraints1581667777298';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "document_template" ADD CONSTRAINT "unique_lang_docs" UNIQUE ("name", "url", "lang")`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "document_template" DROP CONSTRAINT "unique_lang_docs"`, undefined);
    }
}
