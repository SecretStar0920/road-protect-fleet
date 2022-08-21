import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntegratingOCR1612430281930 implements MigrationInterface {
    name = 'IntegratingOCR1612430281930';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" ADD "ocr" jsonb DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "ocr"`);
    }
}
