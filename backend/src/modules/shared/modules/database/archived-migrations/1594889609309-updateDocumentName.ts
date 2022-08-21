import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDocumentName1594889609309 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`UPDATE document_template SET "name" = 'LeaseSubstitute' WHERE "name" = 'Redirection';`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`UPDATE document_template SET "name" = 'Redirection' WHERE "name" = 'LeaseSubstitute';`, undefined);
    }
}
