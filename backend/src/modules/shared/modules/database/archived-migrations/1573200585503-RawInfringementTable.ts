import { MigrationInterface, QueryRunner } from 'typeorm';

export class RawInfringementTable1573200585503 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "raw_infringement_status_enum" AS ENUM('Pending', 'Failed', 'Completed')`);
        await queryRunner.query(
            `CREATE TABLE "raw_infringement" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "rawInfringementId" SERIAL NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', "status" "raw_infringement_status_enum" NOT NULL DEFAULT 'Pending', "clientClientId" integer NOT NULL, CONSTRAINT "PK_50c9190bc94fefd59512c040c21" PRIMARY KEY ("rawInfringementId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_50c9190bc94fefd59512c040c2" ON "raw_infringement" ("rawInfringementId") `);
        await queryRunner.query(
            `ALTER TABLE "raw_infringement" ADD CONSTRAINT "FK_b140144263ae38b9e2b4351964b" FOREIGN KEY ("clientClientId") REFERENCES "client"("clientId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "raw_infringement" DROP CONSTRAINT "FK_b140144263ae38b9e2b4351964b"`);
        await queryRunner.query(`DROP INDEX "IDX_50c9190bc94fefd59512c040c2"`);
        await queryRunner.query(`DROP TABLE "raw_infringement"`);
        await queryRunner.query(`DROP TYPE "raw_infringement_status_enum"`);
    }
}
