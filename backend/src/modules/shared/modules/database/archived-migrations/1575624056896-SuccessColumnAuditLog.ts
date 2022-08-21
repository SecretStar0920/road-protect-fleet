import { MigrationInterface, QueryRunner } from 'typeorm';

export class SuccessColumnAuditLog1575624056896 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "success" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "success"`);
    }
}
