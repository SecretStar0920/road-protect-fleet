import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLoginAttemptsToUser1611328236809 implements MigrationInterface {
    name = 'AddedLoginAttemptsToUser1611328236809';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "loginAttempts" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "loginAttempts"`);
    }
}
