import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumenTemplateTable1579521746294 implements MigrationInterface {
    name = 'DocumenTemplateTable1579521746294';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "document_template" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "documentTemplateId" SERIAL NOT NULL, CONSTRAINT "PK_a49759c8fe311afe016454ab281" PRIMARY KEY ("documentTemplateId"))`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "document_template"`, undefined);
    }
}
