import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneratedDocumentTable1579679113108 implements MigrationInterface {
    name = 'GeneratedDocumentTable1579679113108';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "generated_document" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "generatedDocumentId" SERIAL NOT NULL, "documentTemplateDocumentTemplateId" integer NOT NULL, CONSTRAINT "PK_02e747fe3e82783cfdc936715fb" PRIMARY KEY ("generatedDocumentId"))`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "generated_document" ADD CONSTRAINT "FK_4cb0861efdf3ad3a42e24805571" FOREIGN KEY ("documentTemplateDocumentTemplateId") REFERENCES "document_template"("documentTemplateId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" DROP CONSTRAINT "FK_4cb0861efdf3ad3a42e24805571"`, undefined);
        await queryRunner.query(`DROP TABLE "generated_document"`, undefined);
    }
}
