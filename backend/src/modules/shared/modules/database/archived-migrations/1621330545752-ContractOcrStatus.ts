import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractOcrStatus1621330545753 implements MigrationInterface {
    name = 'ContractOcrStatus1621330545753';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ADD "preventRedirections" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "contract_ocrstatus_enum" AS ENUM('Success', 'Failed', 'Incomplete', 'Modified')`);
        await queryRunner.query(`ALTER TABLE "contract" ADD "ocrStatus" "contract_ocrstatus_enum" DEFAULT 'Incomplete'`);
        await queryRunner.query(`CREATE INDEX "IDX_152f41c40f2870a6558531eb7f" ON "contract" ("ocrStatus") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_152f41c40f2870a6558531eb7f"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "ocrStatus"`);
        await queryRunner.query(`DROP TYPE "contract_ocrstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "preventRedirections"`);
    }
}
