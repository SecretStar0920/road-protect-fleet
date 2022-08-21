import { MigrationInterface, QueryRunner } from 'typeorm';

export class RedirectionTargetColumn1585902863462 implements MigrationInterface {
    name = 'RedirectionTargetColumn1585902863462';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "nomination" ADD "redirectionTargetAccountId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "FK_23b9d725d51e99cf724f0a93fa0"`, undefined);
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "accountId" DROP NOT NULL`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e98592a63c6483c77d32b823c5" ON "nomination" ("redirectionTargetAccountId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a5ac4996609048ea30d210234c" ON "nomination" ("documentId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e492bf00be0e27876596211e7c" ON "nomination" ("redirectionDocumentId") `, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "FK_23b9d725d51e99cf724f0a93fa0" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "FK_e98592a63c6483c77d32b823c5e" FOREIGN KEY ("redirectionTargetAccountId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "FK_e98592a63c6483c77d32b823c5e"`, undefined);
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "FK_23b9d725d51e99cf724f0a93fa0"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e492bf00be0e27876596211e7c"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a5ac4996609048ea30d210234c"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e98592a63c6483c77d32b823c5"`, undefined);
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "accountId" SET NOT NULL`, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "FK_23b9d725d51e99cf724f0a93fa0" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "redirectionTargetAccountId"`, undefined);
    }
}
