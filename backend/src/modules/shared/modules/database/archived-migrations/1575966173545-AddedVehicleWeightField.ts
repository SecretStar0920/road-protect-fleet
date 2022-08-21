import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedVehicleWeightField1575966173545 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "vehicle" RENAME COLUMN "year" TO "modelYear"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "weight" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "vehicle" RENAME COLUMN "modelYear" TO "year"`);
    }
}
