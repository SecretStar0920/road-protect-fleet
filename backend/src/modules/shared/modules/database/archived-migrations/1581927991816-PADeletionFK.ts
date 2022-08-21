import { MigrationInterface, QueryRunner } from 'typeorm';

export class PADeletionFK1581927991816 implements MigrationInterface {
    name = 'PADeletionFK1581927991816';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_c014cb6be22b232f24346bfe47c"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "document_template" ADD CONSTRAINT "unique_lang_docs" UNIQUE ("name", "url", "lang")`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_c014cb6be22b232f24346bfe47c" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_c014cb6be22b232f24346bfe47c"`, undefined);
        await queryRunner.query(`ALTER TABLE "document_template" DROP CONSTRAINT "unique_lang_docs"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_c014cb6be22b232f24346bfe47c" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
