import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyPenaltyAmounts1614321597350 implements MigrationInterface {
    name = 'modifyPenaltyAmounts1614321597350';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "infringement" SET "penaltyAmount" = 0 WHERE "penaltyAmount" < 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
