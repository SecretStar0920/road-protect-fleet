import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditLog1575621937936 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "audit_log" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "auditLogId" SERIAL NOT NULL, "action" jsonb NOT NULL DEFAULT '{}', "userId" integer, CONSTRAINT "PK_16e719e570e70a2e277569d4d94" PRIMARY KEY ("auditLogId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_16e719e570e70a2e277569d4d9" ON "audit_log" ("auditLogId") `);
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2621409ebc295c5da7ff3e41396" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2621409ebc295c5da7ff3e41396"`);
        await queryRunner.query(`DROP INDEX "IDX_16e719e570e70a2e277569d4d9"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
    }
}
