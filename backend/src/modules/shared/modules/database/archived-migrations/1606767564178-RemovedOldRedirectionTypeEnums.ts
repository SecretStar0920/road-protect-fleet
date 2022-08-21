import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedOldRedirectionTypeEnums1606767564178 implements MigrationInterface {
    name = 'RemovedOldRedirectionTypeEnums1606767564178';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."nomination_redirectiontype_enum" RENAME TO "nomination_redirectiontype_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "nomination_redirectiontype_enum" AS ENUM('Manual Email', 'ATG Integration', 'Manual Upload')`,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum" USING "redirectionType"::"text"::"nomination_redirectiontype_enum"`,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "nomination_redirectiontype_enum_old" AS ENUM('Manual', 'ATG', 'Manual Upload', 'Manual Email', 'ATG Integration')`,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum_old" USING "redirectionType"::"text"::"nomination_redirectiontype_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum"`);
        await queryRunner.query(`ALTER TYPE "nomination_redirectiontype_enum_old" RENAME TO  "nomination_redirectiontype_enum"`);
    }
}
