import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountAuditLogFK1575622987437 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "accountId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_d64a1164e72b0121fbc0737801" ON "audit_log" ("accountId") `);
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_d64a1164e72b0121fbc07378017" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_d64a1164e72b0121fbc07378017"`);
        await queryRunner.query(`DROP INDEX "IDX_d64a1164e72b0121fbc0737801"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "accountId"`);
    }
}
