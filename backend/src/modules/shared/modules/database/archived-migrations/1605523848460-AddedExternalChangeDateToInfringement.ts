import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedExternalChangeDateToInfringement1605523848460 implements MigrationInterface {
    name = 'AddedExternalChangeDateToInfringement1605523848460';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" ADD "externalChangeDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "infringement_external_change_date_idx" ON "infringement" ("externalChangeDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "infringement_external_change_date_idx"`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "externalChangeDate"`);
    }
}
