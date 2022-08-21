import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameReferenceIdToReference1578384219795 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" RENAME COLUMN "referenceId" TO "reference"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" RENAME COLUMN "reference" TO "referenceId"`);
    }
}
