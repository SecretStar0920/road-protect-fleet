import { MigrationInterface, QueryRunner } from 'typeorm';
// Second
export class AddFrontendUserPreferencesJson1619031831672 implements MigrationInterface {
    name = 'AddFrontendUserPreferencesJson1619031831672';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "frontendUserPreferences" jsonb NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "frontendUserPreferences"`);
    }
}
