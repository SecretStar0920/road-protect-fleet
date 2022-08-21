import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeatureFlagEntity1589726487337 implements MigrationInterface {
    name = 'FeatureFlagEntity1589726487337';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "feature_flag" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "featureFlagId" SERIAL NOT NULL, "title" text NOT NULL, "description" text, "message" text, "enabled" boolean NOT NULL, CONSTRAINT "PK_f05be8cceb8b048d84e62ea11ee" PRIMARY KEY ("featureFlagId"))`,
            undefined,
        );
        await queryRunner.query(`CREATE INDEX "IDX_f05be8cceb8b048d84e62ea11e" ON "feature_flag" ("featureFlagId") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4cda00dfc8ed9b05237d67bb39" ON "feature_flag" ("title") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4cda00dfc8ed9b05237d67bb39"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f05be8cceb8b048d84e62ea11e"`, undefined);
        await queryRunner.query(`DROP TABLE "feature_flag"`, undefined);
    }
}
