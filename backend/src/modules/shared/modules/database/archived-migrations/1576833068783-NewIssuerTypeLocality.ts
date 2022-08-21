import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewIssuerTypeLocality1576833068783 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."issuer_type_enum" RENAME TO "issuer_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "issuer_type_enum" AS ENUM('Municipal', 'Regional', 'Local', 'Locality')`);
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "issuer" ALTER COLUMN "type" TYPE "issuer_type_enum" USING "type"::"text"::"issuer_type_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "type" SET DEFAULT 'Municipal'`);
        await queryRunner.query(`DROP TYPE "issuer_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "issuer_type_enum_old" AS ENUM('Municipal', 'Regional', 'Local')`);
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "issuer" ALTER COLUMN "type" TYPE "issuer_type_enum_old" USING "type"::"text"::"issuer_type_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "type" SET DEFAULT 'Municipal'`);
        await queryRunner.query(`DROP TYPE "issuer_type_enum"`);
        await queryRunner.query(`ALTER TYPE "issuer_type_enum_old" RENAME TO  "issuer_type_enum"`);
    }
}
