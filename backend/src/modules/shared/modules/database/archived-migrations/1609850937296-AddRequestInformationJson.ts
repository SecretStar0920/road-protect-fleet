import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRequestInformationJson1609850937296 implements MigrationInterface {
    name = 'AddRequestInformationJson1609850937296';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "requestInformationDetails" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "requestInformationDetails"`);
    }
}
