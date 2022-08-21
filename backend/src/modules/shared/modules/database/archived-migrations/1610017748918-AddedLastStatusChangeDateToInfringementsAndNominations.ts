import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLastStatusChangeDateToInfringementsAndNominations1610017748918 implements MigrationInterface {
    name = 'AddedLastStatusChangeDateToInfringementsAndNominations1610017748918';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD "lastStatusChangeDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD "lastStatusChangeDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "lastStatusChangeDate"`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "lastStatusChangeDate"`);
    }
}
