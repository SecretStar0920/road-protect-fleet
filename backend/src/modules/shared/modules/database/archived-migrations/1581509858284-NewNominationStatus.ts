import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewNominationStatus1581509858284 implements MigrationInterface {
    name = 'NewNominationStatus1581509858284';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."nomination_status_enum" RENAME TO "nomination_status_enum_old"`, undefined);
        await queryRunner.query(
            `CREATE TYPE "nomination_status_enum" AS ENUM('Pending', 'Acknowledged', 'Approved for Payment', 'Appealed', 'Manually Paid', 'Paid', 'Closed', 'In Nomination Process')`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "status" TYPE "nomination_status_enum" USING "status"::"text"::"nomination_status_enum"`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" SET DEFAULT 'Pending'`, undefined);
        await queryRunner.query(`DROP TYPE "nomination_status_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TYPE "nomination_status_enum_old" AS ENUM('Pending', 'Acknowledged', 'Approved for Payment', 'Appealed', 'Manually Paid', 'Paid', 'Closed')`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "status" TYPE "nomination_status_enum_old" USING "status"::"text"::"nomination_status_enum_old"`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" SET DEFAULT 'Pending'`, undefined);
        await queryRunner.query(`DROP TYPE "nomination_status_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "nomination_status_enum_old" RENAME TO  "nomination_status_enum"`, undefined);
    }
}
