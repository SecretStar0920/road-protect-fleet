import { MigrationInterface, QueryRunner } from 'typeorm';

export class NominationDocumentFK1580290260402 implements MigrationInterface {
    name = 'NominationDocumentFK1580290260402';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "FK_a5ac4996609048ea30d210234c4"`, undefined);
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "REL_a5ac4996609048ea30d210234c"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "FK_a5ac4996609048ea30d210234c4" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "FK_a5ac4996609048ea30d210234c4"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "REL_a5ac4996609048ea30d210234c" UNIQUE ("documentId")`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "FK_a5ac4996609048ea30d210234c4" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
