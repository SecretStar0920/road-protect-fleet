import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTypeToVehicles1611867414647 implements MigrationInterface {
    name = 'AddedTypeToVehicles1611867414647';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "vehicle_type_enum" AS ENUM('Private', 'Truck')`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "type" "vehicle_type_enum" NOT NULL DEFAULT 'Private'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "vehicle_type_enum"`);
    }
}
