import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentTemplateMinimalKeys1579523021810 implements MigrationInterface {
    name = 'DocumentTemplateMinimalKeys1579523021810';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "document_template" ADD "name" text NOT NULL`, undefined);
        await queryRunner.query(
            `ALTER TABLE "document_template" ADD CONSTRAINT "UQ_98d8a33b09cf2e1d48ee94a460b" UNIQUE ("name")`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "document_template" ADD "url" text NOT NULL`, undefined);
        await queryRunner.query(
            `ALTER TABLE "document_template" ADD CONSTRAINT "UQ_8bd6754c101de18c3d45eeeccb0" UNIQUE ("url")`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "document_template" ADD "form" jsonb NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "document_template" DROP COLUMN "form"`, undefined);
        await queryRunner.query(`ALTER TABLE "document_template" DROP CONSTRAINT "UQ_8bd6754c101de18c3d45eeeccb0"`, undefined);
        await queryRunner.query(`ALTER TABLE "document_template" DROP COLUMN "url"`, undefined);
        await queryRunner.query(`ALTER TABLE "document_template" DROP CONSTRAINT "UQ_98d8a33b09cf2e1d48ee94a460b"`, undefined);
        await queryRunner.query(`ALTER TABLE "document_template" DROP COLUMN "name"`, undefined);
    }
}
