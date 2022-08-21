import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateLanguageColumn1580304571592 implements MigrationInterface {
    name = 'TemplateLanguageColumn1580304571592';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "document_template_lang_enum" AS ENUM('en', 'he')`, undefined);
        await queryRunner.query(
            `ALTER TABLE "document_template" ADD "lang" "document_template_lang_enum" NOT NULL DEFAULT 'he'`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "document_template" DROP COLUMN "lang"`, undefined);
        await queryRunner.query(`DROP TYPE "document_template_lang_enum"`, undefined);
    }
}
