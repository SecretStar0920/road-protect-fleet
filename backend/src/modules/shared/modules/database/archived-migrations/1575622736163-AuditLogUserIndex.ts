import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditLogUserIndex1575622736163 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_2621409ebc295c5da7ff3e4139" ON "audit_log" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_2621409ebc295c5da7ff3e4139"`);
    }
}
