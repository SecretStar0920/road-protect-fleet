import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmailLog1620114872372 implements MigrationInterface {
    name = 'CreateEmailLog1620114872372';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "email_log_template_enum" AS ENUM('account-invitation', 'account-user-role-change', 'account-user-removal', 'user-creation', 'forgot-password', 'vehicle-addition-notification', 'vehicle-lease-notification', 'infringement-reports', 'request-information', 'municipal-redirection', 'failed-payment-user-notification', 'failed-payment-admin-notification')`,
        );
        await queryRunner.query(
            `CREATE TABLE "email_log" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "emailLogId" SERIAL NOT NULL, "template" "email_log_template_enum" NOT NULL, "to" text NOT NULL, "cc" jsonb NOT NULL DEFAULT '{}', "bcc" jsonb NOT NULL DEFAULT '{}', "success" boolean NOT NULL DEFAULT true, "details" jsonb NOT NULL DEFAULT '{}', "context" jsonb NOT NULL DEFAULT '{}', "attachments" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fc129e64835d5b8a1d105c45e02" PRIMARY KEY ("emailLogId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fc129e64835d5b8a1d105c45e0" ON "email_log" ("emailLogId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_fc129e64835d5b8a1d105c45e0"`);
        await queryRunner.query(`DROP TABLE "email_log"`);
        await queryRunner.query(`DROP TYPE "email_log_template_enum"`);
    }
}
