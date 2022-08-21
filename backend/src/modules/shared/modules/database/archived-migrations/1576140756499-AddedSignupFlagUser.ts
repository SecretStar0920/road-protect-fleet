import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedSignupFlagUser1576140756499 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "completedSignup" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "completedSignup"`);
    }
}
