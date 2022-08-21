import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequiredFKsAuditLog1575623039692 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2621409ebc295c5da7ff3e41396"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_d64a1164e72b0121fbc07378017"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "accountId" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2621409ebc295c5da7ff3e41396" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_d64a1164e72b0121fbc07378017" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_d64a1164e72b0121fbc07378017"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2621409ebc295c5da7ff3e41396"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "accountId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_d64a1164e72b0121fbc07378017" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2621409ebc295c5da7ff3e41396" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
