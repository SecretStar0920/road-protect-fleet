import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDocumentFKToGeneratedDocument1579683196190 implements MigrationInterface {
    name = 'AddedDocumentFKToGeneratedDocument1579683196190';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" ADD "documentId" integer`, undefined);
        await queryRunner.query(
            `ALTER TABLE "generated_document" ADD CONSTRAINT "UQ_9019a71b145be6391e555e18ad6" UNIQUE ("documentId")`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "generated_document" ADD CONSTRAINT "FK_9019a71b145be6391e555e18ad6" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" DROP CONSTRAINT "FK_9019a71b145be6391e555e18ad6"`, undefined);
        await queryRunner.query(`ALTER TABLE "generated_document" DROP CONSTRAINT "UQ_9019a71b145be6391e555e18ad6"`, undefined);
        await queryRunner.query(`ALTER TABLE "generated_document" DROP COLUMN "documentId"`, undefined);
    }
}
