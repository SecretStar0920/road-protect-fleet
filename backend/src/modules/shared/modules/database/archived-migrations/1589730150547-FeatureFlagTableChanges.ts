import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeatureFlagTableChanges1589730150547 implements MigrationInterface {
    name = 'FeatureFlagTableChanges1589730150547';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature_flag" DROP COLUMN "message"`, undefined);
        await queryRunner.query(`ALTER TABLE "feature_flag" ADD "disabledMessage" text`, undefined);
        await queryRunner.query(`ALTER TABLE "feature_flag" ADD "category" text DEFAULT 'operations'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature_flag" DROP COLUMN "category"`, undefined);
        await queryRunner.query(`ALTER TABLE "feature_flag" DROP COLUMN "disabledMessage"`, undefined);
        await queryRunner.query(`ALTER TABLE "feature_flag" ADD "message" text`, undefined);
    }
}
