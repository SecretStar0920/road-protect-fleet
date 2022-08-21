import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableFKInfringement1575268770999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "details" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP CONSTRAINT "FK_b066f1614f10ca760510d8bee12"`);
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "contractId" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD CONSTRAINT "FK_b066f1614f10ca760510d8bee12" FOREIGN KEY ("contractId") REFERENCES "contract"("contractId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP CONSTRAINT "FK_b066f1614f10ca760510d8bee12"`);
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "contractId" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD CONSTRAINT "FK_b066f1614f10ca760510d8bee12" FOREIGN KEY ("contractId") REFERENCES "contract"("contractId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "details" SET DEFAULT '{}'`);
    }
}
