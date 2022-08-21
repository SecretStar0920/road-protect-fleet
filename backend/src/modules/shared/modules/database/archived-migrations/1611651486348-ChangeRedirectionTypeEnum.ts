import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRedirectionTypeEnum1611651486348 implements MigrationInterface {
    name = 'ChangeRedirectionTypeEnum1611651486348';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."nomination_redirectiontype_enum" RENAME TO "nomination_redirectiontype_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "nomination_redirectiontype_enum" AS ENUM('Manual Email', 'ATG Integration', 'Manual Upload', 'External', 'Telaviv')`,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum" USING "redirectionType"::"text"::"nomination_redirectiontype_enum"`,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "nomination_redirectiontype_enum_old" AS ENUM('Manual Email', 'ATG Integration', 'Manual Upload', 'External')`,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum_old" USING "redirectionType"::"text"::"nomination_redirectiontype_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum"`);
        await queryRunner.query(`ALTER TYPE "nomination_redirectiontype_enum_old" RENAME TO  "nomination_redirectiontype_enum"`);
    }
}
