import { MigrationInterface, QueryRunner } from 'typeorm';

export class NominationRedirectionDocument1585053953279 implements MigrationInterface {
    name = 'NominationRedirectionDocument1585053953279';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "nomination" ADD "redirectionDocumentId" integer`, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "FK_e492bf00be0e27876596211e7c6" FOREIGN KEY ("redirectionDocumentId") REFERENCES "document"("documentId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "FK_e492bf00be0e27876596211e7c6"`, undefined);
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "redirectionDocumentId"`, undefined);
    }
}
