import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementRevisionHistoryTable1594107234212 implements MigrationInterface {
    name = 'InfringementRevisionHistoryTable1594107234212';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "infringement_revision_history_action_enum" AS ENUM('INSERT', 'UPDATE', 'DELETE')`, undefined);
        await queryRunner.query(
            `CREATE TABLE "infringement_revision_history" ("infringementHistoryId" SERIAL NOT NULL, "infringementId" integer NOT NULL, "action" "infringement_revision_history_action_enum" NOT NULL, "old" jsonb, "new" jsonb, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_7d864c9300052d5cd8b422e3daf" PRIMARY KEY ("infringementHistoryId"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_dd0ed71a855aac1c3cd395b88a" ON "infringement_revision_history" ("infringementId") `,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_dd0ed71a855aac1c3cd395b88a"`, undefined);
        await queryRunner.query(`DROP TABLE "infringement_revision_history"`, undefined);
        await queryRunner.query(`DROP TYPE "infringement_revision_history_action_enum"`, undefined);
    }
}
