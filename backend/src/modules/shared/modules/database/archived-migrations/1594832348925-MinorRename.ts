import { MigrationInterface, QueryRunner } from 'typeorm';

export class MinorRename1594832348925 implements MigrationInterface {
    name = 'MinorRename1594832348925';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."nomination_redirectiontype_enum" RENAME TO "nomination_redirectiontype_enum_old"`,
            undefined,
        );
        // Set redirection type as text
        await queryRunner.query(`ALTER TABLE public.nomination ALTER COLUMN "redirectionType" TYPE text;`);
        // Perform renames
        await queryRunner.query(`UPDATE public.nomination SET "redirectionType" = 'ATG' WHERE "redirectionType" = 'Integration'`);

        // Carry on
        await queryRunner.query(`CREATE TYPE "nomination_redirectiontype_enum" AS ENUM('Manual', 'ATG')`, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum" USING "redirectionType"::"text"::"nomination_redirectiontype_enum"`,
            undefined,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "nomination_redirectiontype_enum_old" AS ENUM('Manual', 'Integration')`, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum_old" USING "redirectionType"::"text"::"nomination_redirectiontype_enum_old"`,
            undefined,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "nomination_redirectiontype_enum_old" RENAME TO  "nomination_redirectiontype_enum"`, undefined);
    }
}
