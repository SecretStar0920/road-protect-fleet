import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneratedDocumentComplete1579679874788 implements MigrationInterface {
    name = 'GeneratedDocumentComplete1579679874788';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" ADD "complete" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" DROP COLUMN "complete"`, undefined);
    }
}
