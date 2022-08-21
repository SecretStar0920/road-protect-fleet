import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountRevisionHistoryTable1596551276000 implements MigrationInterface {
    name = 'AccountRevisionHistoryTable1596551276000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "account_revision_history_action_enum" AS ENUM('INSERT', 'UPDATE', 'DELETE')`, undefined);
        await queryRunner.query(
            `CREATE TABLE "account_revision_history" ("accountHistoryId" SERIAL NOT NULL, "accountId" integer NOT NULL, "action" "account_revision_history_action_enum" NOT NULL, "old" jsonb, "new" jsonb, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_10ada0ca874d0642b65cc765295" PRIMARY KEY ("accountHistoryId"))`,
            undefined,
        );
        await queryRunner.query(`CREATE INDEX "IDX_a03cf95117cd9a152c281bd226" ON "account_revision_history" ("accountId") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_a03cf95117cd9a152c281bd226"`, undefined);
        await queryRunner.query(`DROP TABLE "account_revision_history"`, undefined);
        await queryRunner.query(`DROP TYPE "account_revision_history_action_enum"`, undefined);
    }
}
