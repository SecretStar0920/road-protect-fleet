import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementBRN1576580129666 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement" ADD "brn" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "brn"`);
    }
}
