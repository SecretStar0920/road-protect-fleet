import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClusterNodeChangeEmail1625663954158 implements MigrationInterface {
    name = 'ClusterNodeChangeEmail1625663954158';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."email_log_template_enum" RENAME TO "email_log_template_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "email_log_template_enum" AS ENUM('account-invitation', 'account-user-role-change', 'account-user-removal', 'user-creation', 'forgot-password', 'vehicle-addition-notification', 'vehicle-lease-notification', 'infringement-reports', 'request-information', 'municipal-redirection', 'failed-payment-user-notification', 'failed-payment-admin-notification', 'cluster-node-change')`,
        );
        await queryRunner.query(
            `ALTER TABLE "email_log" ALTER COLUMN "template" TYPE "email_log_template_enum" USING "template"::"text"::"email_log_template_enum"`,
        );
        await queryRunner.query(`DROP TYPE "email_log_template_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "email_log_template_enum_old" AS ENUM('account-invitation', 'account-user-role-change', 'account-user-removal', 'user-creation', 'forgot-password', 'vehicle-addition-notification', 'vehicle-lease-notification', 'infringement-reports', 'request-information', 'municipal-redirection', 'failed-payment-user-notification', 'failed-payment-admin-notification')`,
        );
        await queryRunner.query(
            `ALTER TABLE "email_log" ALTER COLUMN "template" TYPE "email_log_template_enum_old" USING "template"::"text"::"email_log_template_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "email_log_template_enum"`);
        await queryRunner.query(`ALTER TYPE "email_log_template_enum_old" RENAME TO  "email_log_template_enum"`);
    }
}
