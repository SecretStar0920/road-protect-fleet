import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountIndexChanges1594106459268 implements MigrationInterface {
    name = 'AccountIndexChanges1594106459268';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "googleLocation" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "hasGoogleResult" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "hasGoogleResult" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "googleLocation" SET NOT NULL`, undefined);
    }
}
