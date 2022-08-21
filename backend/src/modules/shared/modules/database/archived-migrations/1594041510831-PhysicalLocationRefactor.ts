import { MigrationInterface, QueryRunner } from 'typeorm';

export class PhysicalLocationRefactor1594041510831 implements MigrationInterface {
    name = 'PhysicalLocationRefactor1594041510831';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_1ebd7ab189bb81162d7e345f81a"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" RENAME COLUMN "locationId" TO "physicalLocationId"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "account" RENAME CONSTRAINT "REL_1ebd7ab189bb81162d7e345f81" TO "UQ_e58b1003c0ceebdca828f79c21a"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_e58b1003c0ceebdca828f79c21a" FOREIGN KEY ("physicalLocationId") REFERENCES "location"("locationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_e58b1003c0ceebdca828f79c21a"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "account" RENAME CONSTRAINT "UQ_e58b1003c0ceebdca828f79c21a" TO "REL_1ebd7ab189bb81162d7e345f81"`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "account" RENAME COLUMN "physicalLocationId" TO "locationId"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_1ebd7ab189bb81162d7e345f81a" FOREIGN KEY ("locationId") REFERENCES "location"("locationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
