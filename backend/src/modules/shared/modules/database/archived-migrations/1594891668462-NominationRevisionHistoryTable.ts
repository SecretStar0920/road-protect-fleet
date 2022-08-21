import { MigrationInterface, QueryRunner } from 'typeorm';

export class NominationRevisionHistoryTable1594891668462 implements MigrationInterface {
    name = 'NominationRevisionHistoryTable1594891668462';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "nomination_revision_history_action_enum" AS ENUM('INSERT', 'UPDATE', 'DELETE')`, undefined);
        await queryRunner.query(
            `CREATE TABLE "nomination_revision_history" ("nominationHistoryId" SERIAL NOT NULL, "nominationId" integer NOT NULL, "action" "nomination_revision_history_action_enum" NOT NULL, "old" jsonb, "new" jsonb, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_9600c443ece9ece083c0772a7d6" PRIMARY KEY ("nominationHistoryId"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_8ca538f0a5dfee365bb70f589d" ON "nomination_revision_history" ("nominationId") `,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_8ca538f0a5dfee365bb70f589d"`, undefined);
        await queryRunner.query(`DROP TABLE "nomination_revision_history"`, undefined);
        await queryRunner.query(`DROP TYPE "nomination_revision_history_action_enum"`, undefined);
    }
}
