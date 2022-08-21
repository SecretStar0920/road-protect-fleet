import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignProviderToJerusalemIssuer1606992456464 implements MigrationInterface {
    name = 'AssignProviderToJerusalemIssuer1606992456464';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE issuer SET provider = 'jerusalem-crawler' WHERE code = '3000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE issuer SET provider = NULL WHERE code = '3000'`);
    }
}
