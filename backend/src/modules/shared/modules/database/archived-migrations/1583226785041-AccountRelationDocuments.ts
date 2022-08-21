import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountRelationDocuments1583226785041 implements MigrationInterface {
    name = 'AccountRelationDocuments1583226785041';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "account_relation_document_type_enum" AS ENUM('Power of Attorney', 'Other')`, undefined);
        await queryRunner.query(
            `CREATE TABLE "account_relation_document" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "accountRelationDocumentId" SERIAL NOT NULL, "type" "account_relation_document_type_enum" NOT NULL DEFAULT 'Other', "accountRelationId" integer, "documentId" integer, CONSTRAINT "PK_4eba43ca5127277e3d95f7347b2" PRIMARY KEY ("accountRelationDocumentId"))`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account_relation_document" ADD CONSTRAINT "FK_2c882456894bec7d84d48f62db5" FOREIGN KEY ("accountRelationId") REFERENCES "account_relation"("accountRelationId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account_relation_document" ADD CONSTRAINT "FK_0aa9ac2fda9da1c31c1bd4f5032" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account_relation_document" DROP CONSTRAINT "FK_0aa9ac2fda9da1c31c1bd4f5032"`, undefined);
        await queryRunner.query(`ALTER TABLE "account_relation_document" DROP CONSTRAINT "FK_2c882456894bec7d84d48f62db5"`, undefined);
        await queryRunner.query(`DROP TABLE "account_relation_document"`, undefined);
        await queryRunner.query(`DROP TYPE "account_relation_document_type_enum"`, undefined);
    }
}
