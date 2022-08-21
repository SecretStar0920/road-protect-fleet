import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementLogTable1578487263178 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "infringement_log" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "infringementLogId" SERIAL NOT NULL, "oldStatus" text NOT NULL, "newStatus" text NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', "infringementId" integer, CONSTRAINT "PK_775a35e058033e34a2bf61018c4" PRIMARY KEY ("infringementLogId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_775a35e058033e34a2bf61018c" ON "infringement_log" ("infringementLogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc922b05fe4a49bfeebeafdf4a" ON "infringement_log" ("infringementId") `);
        await queryRunner.query(
            `ALTER TABLE "infringement_log" ADD CONSTRAINT "FK_cc922b05fe4a49bfeebeafdf4a2" FOREIGN KEY ("infringementId") REFERENCES "infringement"("infringementId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement_log" DROP CONSTRAINT "FK_cc922b05fe4a49bfeebeafdf4a2"`);
        await queryRunner.query(`DROP INDEX "IDX_cc922b05fe4a49bfeebeafdf4a"`);
        await queryRunner.query(`DROP INDEX "IDX_775a35e058033e34a2bf61018c"`);
        await queryRunner.query(`DROP TABLE "infringement_log"`);
    }
}
