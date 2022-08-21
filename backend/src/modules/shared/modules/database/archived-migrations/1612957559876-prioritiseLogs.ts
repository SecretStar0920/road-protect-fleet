import { MigrationInterface, QueryRunner } from 'typeorm';

export class prioritiseLogs1612957559876 implements MigrationInterface {
    name = 'prioritiseLogs1612957559876';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "log_priority_enum" AS ENUM('Low', 'Medium', 'High')`);
        await queryRunner.query(`ALTER TABLE "log" ADD "priority" "log_priority_enum" NOT NULL DEFAULT 'Low'`);
        await queryRunner.query(`UPDATE "log" SET "priority" = 'High'`);
        await queryRunner.query(
            `UPDATE "log" SET "priority" = 'Low'
                WHERE "message" IN ('Infringement digitally nominated', 'Infringement has been automatically digitally nominated to the Owner', 'Infringement has been automatically digitally nominated to the Owner based on the contract', 'Infringement has been nominated directly to the BRN provided on the infringement upload / update', 'Invalid infringement status update. Cannot go from Closed to Paid.', 'Invalid infringement status update. Cannot go from Paid to Closed.')
                OR "message" LIKE 'Modified the notice number from%'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" DROP COLUMN "priority"`);
        await queryRunner.query(`DROP TYPE "log_priority_enum"`);
    }
}
