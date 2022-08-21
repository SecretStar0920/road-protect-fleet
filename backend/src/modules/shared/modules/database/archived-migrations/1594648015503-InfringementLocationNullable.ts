import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementLocationNullable1594648015503 implements MigrationInterface {
    name = 'InfringementLocationNullable1594648015503';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP CONSTRAINT "FK_dd42087b7d7870ce3e4c548d2c6"`, undefined);
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "locationId" DROP NOT NULL`, undefined);
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD CONSTRAINT "FK_dd42087b7d7870ce3e4c548d2c6" FOREIGN KEY ("locationId") REFERENCES "location"("locationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP CONSTRAINT "FK_dd42087b7d7870ce3e4c548d2c6"`, undefined);
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "locationId" SET NOT NULL`, undefined);
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD CONSTRAINT "FK_dd42087b7d7870ce3e4c548d2c6" FOREIGN KEY ("locationId") REFERENCES "location"("locationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
