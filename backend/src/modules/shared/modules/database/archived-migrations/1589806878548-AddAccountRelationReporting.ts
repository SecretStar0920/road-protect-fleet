import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountRelationReporting1589806878548 implements MigrationInterface {
    name = 'AddAccountRelationReporting1589806878548';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_relation" ADD "accountRelationReporting" jsonb`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_relation" DROP COLUMN "accountRelationReporting"`, undefined);
    }
}
