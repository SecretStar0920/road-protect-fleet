import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewUserType1576583738407 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."user_type_enum" RENAME TO "user_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "user_type_enum" AS ENUM('Admin', 'Developer', 'Standard', 'API')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "type" TYPE "user_type_enum" USING "type"::"text"::"user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "type" SET DEFAULT 'Standard'`);
        await queryRunner.query(`DROP TYPE "user_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "user_type_enum_old" AS ENUM('Admin', 'Developer', 'Standard')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "type" TYPE "user_type_enum_old" USING "type"::"text"::"user_type_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "type" SET DEFAULT 'Standard'`);
        await queryRunner.query(`DROP TYPE "user_type_enum"`);
        await queryRunner.query(`ALTER TYPE "user_type_enum_old" RENAME TO  "user_type_enum"`);
    }
}
