import { MigrationInterface, QueryRunner } from 'typeorm';

export class LastSuccessfulPayment1622028933550 implements MigrationInterface {
    name = 'LastSuccessfulPayment1622028933550';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "successfulInfringementId" integer`);
        await queryRunner.query(
            `ALTER TABLE "payment" ADD CONSTRAINT "UQ_cb7a2d4818000cf3aeb8722f3de" UNIQUE ("successfulInfringementId")`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_cb7a2d4818000cf3aeb8722f3d" ON "payment" ("successfulInfringementId") `);
        await queryRunner.query(
            `ALTER TABLE "payment" ADD CONSTRAINT "FK_cb7a2d4818000cf3aeb8722f3de" FOREIGN KEY ("successfulInfringementId") REFERENCES "infringement"("infringementId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_cb7a2d4818000cf3aeb8722f3de"`);
        await queryRunner.query(`DROP INDEX "IDX_cb7a2d4818000cf3aeb8722f3d"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "UQ_cb7a2d4818000cf3aeb8722f3de"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "successfulInfringementId"`);
    }
}
