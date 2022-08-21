import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePartialInfringementTable1615454664015 implements MigrationInterface {
    name = 'CreatePartialInfringementTable1615454664015';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "partial_infringement_status_enum" AS ENUM('Pending', 'Queued', 'Processed', 'Successful', 'Failed')`,
        );
        await queryRunner.query(
            `CREATE TABLE "partial_infringement" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "partialInfringementId" SERIAL NOT NULL, "details" jsonb NOT NULL DEFAULT '{}', "noticeNumber" text, "status" "partial_infringement_status_enum" NOT NULL DEFAULT 'Pending', "processedDate" TIMESTAMP WITH TIME ZONE, "response" jsonb, CONSTRAINT "PK_89b52bf9d63ad1c2bd844e1ca57" PRIMARY KEY ("partialInfringementId"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_89b52bf9d63ad1c2bd844e1ca5" ON "partial_infringement" ("partialInfringementId") `,
        );
        await queryRunner.query(`CREATE INDEX "IDX_dd256ce2b054dfde5763656a10" ON "partial_infringement" ("processedDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_dd256ce2b054dfde5763656a10"`);
        await queryRunner.query(`DROP INDEX "IDX_89b52bf9d63ad1c2bd844e1ca5"`);
        await queryRunner.query(`DROP TABLE "partial_infringement"`);
        await queryRunner.query(`DROP TYPE "partial_infringement_status_enum"`);
    }
}
