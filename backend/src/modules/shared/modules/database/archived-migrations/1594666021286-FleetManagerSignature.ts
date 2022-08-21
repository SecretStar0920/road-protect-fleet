import { MigrationInterface, QueryRunner } from 'typeorm';

export class FleetManagerSignature1594666021286 implements MigrationInterface {
    name = 'FleetManagerSignature1594666021286';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "fleetManagerDetails" jsonb`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "fleetManagerDetails"`, undefined);
    }
}
