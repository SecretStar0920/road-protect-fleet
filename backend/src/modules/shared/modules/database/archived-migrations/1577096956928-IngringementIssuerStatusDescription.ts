import { MigrationInterface, QueryRunner } from 'typeorm';

export class IngringementIssuerStatusDescription1577096956928 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement" ADD "issuerStatusDescription" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "issuerStatusDescription"`);
    }
}
