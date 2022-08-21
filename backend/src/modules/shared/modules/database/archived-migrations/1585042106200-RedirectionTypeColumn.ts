import { MigrationInterface, QueryRunner } from 'typeorm';

export class RedirectionTypeColumn1585042106200 implements MigrationInterface {
    name = 'RedirectionTypeColumn1585042106200';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "nomination_redirectiontype_enum" AS ENUM('Manual', 'Integration')`, undefined);
        await queryRunner.query(`ALTER TABLE "nomination" ADD "redirectionType" "nomination_redirectiontype_enum"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_221b2574c536f517ea2984c21d" ON "nomination" ("redirectionType") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_221b2574c536f517ea2984c21d"`, undefined);
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "redirectionType"`, undefined);
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum"`, undefined);
    }
}
