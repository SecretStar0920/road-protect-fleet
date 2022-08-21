import { MigrationInterface, QueryRunner } from 'typeorm';

export class RawInfringementResult1591685696511 implements MigrationInterface {
    name = 'RawInfringementResult1591685696511';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raw_infringement" ADD "result" jsonb`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raw_infringement" DROP COLUMN "result"`, undefined);
    }
}
