import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveApprovedForPaymentFromNomination1614580032891 implements MigrationInterface {
    name = 'RemoveApprovedForPaymentFromNomination1614580032891';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // to check if trigger already exists and skip if that's the case drop it the trigger
        const triggerExists = await queryRunner.query(`select tgname from pg_trigger where tgname = 'nomination_status_last_date_change';`);
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            await queryRunner.query(`DROP TRIGGER nomination_status_last_date_change on "nomination"`);
        }

        // then run migration to update status enum
        await queryRunner.query(`DROP INDEX "IDX_dcffa81eab477c623a6e656ada"`);
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "approvedDate"`);
        await queryRunner.query(`ALTER TYPE "public"."nomination_status_enum" RENAME TO "nomination_status_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "nomination_status_enum" AS ENUM('Pending', 'Acknowledged', 'In Redirection Process', 'Closed', 'Redirection Completed')`,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "status" TYPE "nomination_status_enum" USING "status"::"text"::"nomination_status_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "nomination_status_enum_old"`);

        // Lastly create trigger again if it existed in the first place
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            await queryRunner.query(`
            CREATE OR REPLACE FUNCTION process_nomination_status_last_date_change()
            RETURNS TRIGGER AS $nomination_status_last_date_change$
            BEGIN
                UPDATE nomination SET "lastStatusChangeDate" = CURRENT_TIMESTAMP WHERE "nominationId" = NEW."nominationId";
                    RETURN NEW;
                END;
            $nomination_status_last_date_change$ LANGUAGE plpgsql;

            CREATE TRIGGER nomination_status_last_date_change
                AFTER UPDATE ON nomination
                FOR EACH ROW
                WHEN (OLD.status IS DISTINCT FROM NEW.status)
                EXECUTE PROCEDURE process_nomination_status_last_date_change();
        `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // to check if trigger already exists and skip if that's the case drop it the trigger
        const triggerExists = await queryRunner.query(`select tgname from pg_trigger where tgname = 'nomination_status_last_date_change';`);
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            await queryRunner.query(`DROP TRIGGER nomination_status_last_date_change on "nomination"`);
        }

        await queryRunner.query(
            `CREATE TYPE "nomination_status_enum_old" AS ENUM('Acknowledged', 'Approved for Payment', 'Closed', 'In Redirection Process', 'Pending', 'Redirection Completed')`,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "status" TYPE "nomination_status_enum_old" USING "status"::"text"::"nomination_status_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "nomination" ALTER COLUMN "status" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "nomination_status_enum"`);
        await queryRunner.query(`ALTER TYPE "nomination_status_enum_old" RENAME TO  "nomination_status_enum"`);
        await queryRunner.query(`ALTER TABLE "nomination" ADD "approvedDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_dcffa81eab477c623a6e656ada" ON "nomination" ("approvedDate") `);

        // Lastly create trigger again if it existed in the first place
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            await queryRunner.query(`
            CREATE OR REPLACE FUNCTION process_nomination_status_last_date_change()
            RETURNS TRIGGER AS $nomination_status_last_date_change$
            BEGIN
                UPDATE nomination SET "lastStatusChangeDate" = CURRENT_TIMESTAMP WHERE "nominationId" = NEW."nominationId";
                    RETURN NEW;
                END;
            $nomination_status_last_date_change$ LANGUAGE plpgsql;

            CREATE TRIGGER nomination_status_last_date_change
                AFTER UPDATE ON nomination
                FOR EACH ROW
                WHEN (OLD.status IS DISTINCT FROM NEW.status)
                EXECUTE PROCEDURE process_nomination_status_last_date_change();
        `);
        }
    }
}
