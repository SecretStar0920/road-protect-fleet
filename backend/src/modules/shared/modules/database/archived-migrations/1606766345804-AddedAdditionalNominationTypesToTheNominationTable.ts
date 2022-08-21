import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedAdditionalNominationTypesToTheNominationTable1606766345804 implements MigrationInterface {
    name = 'AddedAdditionalNominationTypesToTheNominationTable1606766345804';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."nomination_redirectiontype_enum" RENAME TO "nomination_redirectiontype_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "nomination_redirectiontype_enum" AS ENUM('Manual', 'ATG', 'Manual Upload', 'Manual Email', 'ATG Integration')`,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum" USING "redirectionType"::"text"::"nomination_redirectiontype_enum"`,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum_old"`);

        await queryRunner.query(`UPDATE "nomination" SET "redirectionType" = 'ATG Integration' WHERE "redirectionType" = 'ATG'`);
        await queryRunner.query(`UPDATE "nomination" SET "redirectionType" = 'Manual Email' WHERE "redirectionType" = 'Manual'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "nomination_redirectiontype_enum_old" AS ENUM('Manual', 'ATG')`);
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum_old" USING "redirectionType"::"text"::"nomination_redirectiontype_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum"`);
        await queryRunner.query(`ALTER TYPE "nomination_redirectiontype_enum_old" RENAME TO  "nomination_redirectiontype_enum"`);
    }
}
