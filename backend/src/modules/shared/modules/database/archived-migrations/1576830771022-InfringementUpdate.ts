import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementUpdate1576830771022 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP CONSTRAINT "FK_9e7c1373e50047f02de5ab556ed"`);
        await queryRunner.query(`ALTER TYPE "public"."infringement_systemstatus_enum" RENAME TO "infringement_systemstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "infringement_systemstatus_enum" AS ENUM('Missing Contract', 'Missing Vehicle', 'Valid')`);
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "systemStatus" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ALTER COLUMN "systemStatus" TYPE "infringement_systemstatus_enum" USING "systemStatus"::"text"::"infringement_systemstatus_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "systemStatus" SET DEFAULT 'Valid'`);
        await queryRunner.query(`DROP TYPE "infringement_systemstatus_enum_old"`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD CONSTRAINT "FK_9e7c1373e50047f02de5ab556ed" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("vehicleId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP CONSTRAINT "FK_9e7c1373e50047f02de5ab556ed"`);
        await queryRunner.query(`CREATE TYPE "infringement_systemstatus_enum_old" AS ENUM('Missing Contract', 'Valid')`);
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "systemStatus" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ALTER COLUMN "systemStatus" TYPE "infringement_systemstatus_enum_old" USING "systemStatus"::"text"::"infringement_systemstatus_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "systemStatus" SET DEFAULT 'Valid'`);
        await queryRunner.query(`DROP TYPE "infringement_systemstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "infringement_systemstatus_enum_old" RENAME TO  "infringement_systemstatus_enum"`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD CONSTRAINT "FK_9e7c1373e50047f02de5ab556ed" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("vehicleId") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }
}
