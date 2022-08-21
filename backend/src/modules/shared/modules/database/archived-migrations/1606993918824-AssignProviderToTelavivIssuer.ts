import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignProviderToTelavivIssuer1606993918824 implements MigrationInterface {
    name = 'AssignProviderToTelavivIssuer1606993918824';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE issuer SET provider = 'telaviv-crawler' WHERE code = '5000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE issuer SET provider = NULL WHERE code = '5000'`);
    }
}
