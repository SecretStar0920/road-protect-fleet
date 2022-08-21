import { MigrationInterface, QueryRunner } from 'typeorm';

export class RawInfringementFKRename1573200734747 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "raw_infringement" DROP CONSTRAINT "FK_b140144263ae38b9e2b4351964b"`);
        await queryRunner.query(`ALTER TABLE "raw_infringement" RENAME COLUMN "clientClientId" TO "clientId"`);
        await queryRunner.query(
            `ALTER TABLE "raw_infringement" ADD CONSTRAINT "FK_1c7368af06de88aab2e6f54f9a0" FOREIGN KEY ("clientId") REFERENCES "client"("clientId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "raw_infringement" DROP CONSTRAINT "FK_1c7368af06de88aab2e6f54f9a0"`);
        await queryRunner.query(`ALTER TABLE "raw_infringement" RENAME COLUMN "clientId" TO "clientClientId"`);
        await queryRunner.query(
            `ALTER TABLE "raw_infringement" ADD CONSTRAINT "FK_b140144263ae38b9e2b4351964b" FOREIGN KEY ("clientClientId") REFERENCES "client"("clientId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
