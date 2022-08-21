import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateJobTable1609944788112 implements MigrationInterface {
    name = 'UpdateJobTable1609944788112';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "queue" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job" ADD "type" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "queue"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "name" text NOT NULL`);
    }
}
