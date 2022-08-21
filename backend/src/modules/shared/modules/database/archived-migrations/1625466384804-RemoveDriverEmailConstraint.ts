import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDriverEmailConstraint1625466384804 implements MigrationInterface {
    name = 'RemoveDriverEmailConstraint1625466384804';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "unique_driver_email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver" ADD CONSTRAINT "unique_driver_email" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "driver" ALTER COLUMN "email" SET NOT NULL`);
    }
}
