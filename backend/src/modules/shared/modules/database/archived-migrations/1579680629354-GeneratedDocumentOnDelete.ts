import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneratedDocumentOnDelete1579680629354 implements MigrationInterface {
    name = 'GeneratedDocumentOnDelete1579680629354';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" DROP CONSTRAINT "FK_4cb0861efdf3ad3a42e24805571"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "generated_document" ADD CONSTRAINT "FK_4cb0861efdf3ad3a42e24805571" FOREIGN KEY ("documentTemplateDocumentTemplateId") REFERENCES "document_template"("documentTemplateId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" DROP CONSTRAINT "FK_4cb0861efdf3ad3a42e24805571"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "generated_document" ADD CONSTRAINT "FK_4cb0861efdf3ad3a42e24805571" FOREIGN KEY ("documentTemplateDocumentTemplateId") REFERENCES "document_template"("documentTemplateId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
