import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFormToGD1579679619424 implements MigrationInterface {
    name = 'AddedFormToGD1579679619424';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" ADD "form" jsonb NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "generated_document" DROP COLUMN "form"`, undefined);
    }
}
