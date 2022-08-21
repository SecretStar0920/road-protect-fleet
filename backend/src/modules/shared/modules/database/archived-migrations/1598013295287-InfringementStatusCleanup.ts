import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementStatusCleanup1598013295287 implements MigrationInterface {
    name = 'InfringementStatusCleanup1598013295287';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."infringement_status_enum" RENAME TO "infringement_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "infringement_status_enum" AS ENUM('Due', 'Outstanding', 'Paid', 'Closed')`);
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ALTER COLUMN "status" TYPE "infringement_status_enum" USING "status"::"text"::"infringement_status_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "status" SET DEFAULT 'Due'`);
        await queryRunner.query(`DROP TYPE "infringement_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "infringement_status_enum_old" AS ENUM('Due', 'Outstanding', 'Paid', 'Closed', 'Pending', 'Appeal approved', 'Approved for payment', 'Nomination in process')`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ALTER COLUMN "status" TYPE "infringement_status_enum_old" USING "status"::"text"::"infringement_status_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "status" SET DEFAULT 'Due'`);
        await queryRunner.query(`DROP TYPE "infringement_status_enum"`);
        await queryRunner.query(`ALTER TYPE "infringement_status_enum_old" RENAME TO  "infringement_status_enum"`);
    }
}
