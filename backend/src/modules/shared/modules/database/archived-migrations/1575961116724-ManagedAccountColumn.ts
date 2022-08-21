import { MigrationInterface, QueryRunner } from 'typeorm';

export class ManagedAccountColumn1575961116724 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" ADD "managed" text NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "managed"`);
    }
}
