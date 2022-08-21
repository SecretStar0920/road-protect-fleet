import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocationTableChanges1586329044152 implements MigrationInterface {
    name = 'LocationTableChanges1586329044152';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "location" RENAME COLUMN "streetNameOne" TO "streetName"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" RENAME COLUMN "streetNumberOne" TO "streetNumber"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "postOfficeBox" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "proximity" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "rawAddress" text`, undefined);
        // Set raw address column and backup column
        await queryRunner.query(`ALTER TABLE "location" ADD "backupData" JSONB`, undefined);
        await queryRunner.query(`update "location" set "backupData" = row_to_json(location.*)`, undefined);
        await queryRunner.query(
            `UPDATE "location" SET "rawAddress" = array_to_string(array["addressLineOne", "addressLineTwo", "city", "country", "code" ], ', ')`,
            undefined,
        );

        // Drop redundant columns
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "addressLineOne"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "addressLineTwo"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "streetNameTwo"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "streetNumberTwo"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "rawAddress"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "proximity"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "postOfficeBox"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "streetNumberTwo" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "streetNameTwo" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "addressLineTwo" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" ADD "addressLineOne" text`, undefined);
        await queryRunner.query(`ALTER TABLE "location" RENAME COLUMN "streetName" TO "streetNameOne"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" RENAME COLUMN "streetNumber" TO "streetNumberOne"`, undefined);
    }
}
