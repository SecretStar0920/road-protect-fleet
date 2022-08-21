import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableFKNomination1575270243280 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "details" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "FK_6f65717f2a41a3720284298cc79"`);
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "redirectedFromAccountId" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "FK_6f65717f2a41a3720284298cc79" FOREIGN KEY ("redirectedFromAccountId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "nomination" DROP CONSTRAINT "FK_6f65717f2a41a3720284298cc79"`);
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "redirectedFromAccountId" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "nomination" ADD CONSTRAINT "FK_6f65717f2a41a3720284298cc79" FOREIGN KEY ("redirectedFromAccountId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "details" SET DEFAULT '{}'`);
    }
}
