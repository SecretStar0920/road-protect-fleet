import { MigrationInterface, QueryRunner } from 'typeorm';

export class DriverContract1621507475858 implements MigrationInterface {
    name = 'DriverContract1621507475858';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ADD "driverId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_75fff8191175d00b7e4c88b744" ON "contract" ("driverId") `);
        await queryRunner.query(
            `ALTER TABLE "contract" ADD CONSTRAINT "FK_75fff8191175d00b7e4c88b7442" FOREIGN KEY ("driverId") REFERENCES "driver"("driverId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_75fff8191175d00b7e4c88b7442"`);
        await queryRunner.query(`DROP INDEX "IDX_75fff8191175d00b7e4c88b744"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "driverId"`);
    }
}
