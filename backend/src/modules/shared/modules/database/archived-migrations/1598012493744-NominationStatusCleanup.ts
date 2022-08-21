import { MigrationInterface, QueryRunner } from 'typeorm';

export class NominationStatusCleanup1598012493744 implements MigrationInterface {
    name = 'NominationStatusCleanup1598012493744';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."nomination_status_enum" RENAME TO "nomination_status_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "nomination_status_enum" AS ENUM('Pending', 'Acknowledged', 'In Redirection Process', 'Closed', 'Redirection Completed', 'Approved for Payment')`,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" DROP DEFAULT`);
        // Change column type to text temporarily to migrate existing status renames
        await queryRunner.query(`ALTER TABLE public.nomination ALTER COLUMN status TYPE text USING status::text`);
        // Perform renames
        await queryRunner.query(`UPDATE nomination SET status = 'In Redirection Process' WHERE status = 'In Nomination Process'`);
        await queryRunner.query(`UPDATE nomination SET status = 'Redirection Completed' WHERE status = 'Appealed'`);
        // Continue
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "status" TYPE "nomination_status_enum" USING "status"::"text"::"nomination_status_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "nomination_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "nomination_status_enum_old" AS ENUM('Pending', 'Acknowledged', 'In Nomination Process', 'Closed', 'Approved for Payment', 'Appealed', 'Manually Paid', 'Paid')`,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" DROP DEFAULT`);
        // Change column type to text temporarily to migrate existing status renames
        await queryRunner.query(`ALTER TABLE public.nomination ALTER COLUMN status TYPE text USING status::text`);
        // Perform renames
        await queryRunner.query(`UPDATE nomination SET status = 'In Nomination Process' WHERE status = 'In Redirection Process'`);
        await queryRunner.query(`UPDATE nomination SET status = 'Appealed' WHERE status = 'Redirection Completed'`);
        // Continue
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "status" TYPE "nomination_status_enum_old" USING "status"::"text"::"nomination_status_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "nomination_status_enum"`);
        await queryRunner.query(`ALTER TYPE "nomination_status_enum_old" RENAME TO  "nomination_status_enum"`);
    }
}
