import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJobTable1609943568235 implements MigrationInterface {
    name = 'CreateJobTable1609943568235';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "job_status_enum" AS ENUM('Queued', 'Processing', 'Completed', 'Failed')`);
        await queryRunner.query(
            `CREATE TABLE "job" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "jobId" SERIAL NOT NULL, "uuid" uuid NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE, "endTime" TIMESTAMP WITH TIME ZONE, "name" text NOT NULL, "status" "job_status_enum" NOT NULL, "details" jsonb NOT NULL DEFAULT '{}', "error" jsonb, "userId" integer, CONSTRAINT "UQ_163ccf9a50de87d231e06ec0c7c" UNIQUE ("uuid"), CONSTRAINT "PK_1302c6cddf76342df00e55d2e6d" PRIMARY KEY ("jobId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1302c6cddf76342df00e55d2e6" ON "job" ("jobId") `);
        await queryRunner.query(`CREATE INDEX "IDX_308fb0752c2ea332cb79f52cea" ON "job" ("userId") `);
        await queryRunner.query(
            `ALTER TABLE "job" ADD CONSTRAINT "FK_308fb0752c2ea332cb79f52ceaa" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_308fb0752c2ea332cb79f52ceaa"`);
        await queryRunner.query(`DROP INDEX "IDX_308fb0752c2ea332cb79f52cea"`);
        await queryRunner.query(`DROP INDEX "IDX_1302c6cddf76342df00e55d2e6"`);
        await queryRunner.query(`DROP TABLE "job"`);
        await queryRunner.query(`DROP TYPE "job_status_enum"`);
    }
}
