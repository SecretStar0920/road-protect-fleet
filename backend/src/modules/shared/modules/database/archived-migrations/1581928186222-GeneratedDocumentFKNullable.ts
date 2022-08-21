import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneratedDocumentFKNullable1581928186222 implements MigrationInterface {
    name = 'GeneratedDocumentFKNullable1581928186222';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" DROP CONSTRAINT "FK_9019a71b145be6391e555e18ad6"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "generated_document" ADD CONSTRAINT "FK_9019a71b145be6391e555e18ad6" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" DROP CONSTRAINT "FK_9019a71b145be6391e555e18ad6"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "generated_document" ADD CONSTRAINT "FK_9019a71b145be6391e555e18ad6" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
