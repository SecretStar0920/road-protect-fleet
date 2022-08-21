import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocationFieldsSeparation1581596599311 implements MigrationInterface {
    name = 'LocationFieldsSeparation1581596599311';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "location" ADD "streetNameOne" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "streetNumberOne" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "streetNameTwo" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "streetNumberTwo" text`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "streetNumberTwo"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "streetNameTwo"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "streetNumberOne"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "streetNameOne"`, undefined);
    }
}
