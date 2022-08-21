import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequestCacheTable1588668692699 implements MigrationInterface {
    name = 'RequestCacheTable1588668692699';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "request_cache" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "requestCacheId" SERIAL NOT NULL, "requestDetails" jsonb, "responseDetails" jsonb, CONSTRAINT "PK_36bf982b9820c4974545de59102" PRIMARY KEY ("requestCacheId"))`,
            undefined,
        );
        await queryRunner.query(`CREATE INDEX "IDX_36bf982b9820c4974545de5910" ON "request_cache" ("requestCacheId") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_36bf982b9820c4974545de5910"`, undefined);
        await queryRunner.query(`DROP TABLE "request_cache"`, undefined);
    }
}
