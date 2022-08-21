import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApprovedForPaymentInInfringementStatusEnum1613984567121 implements MigrationInterface {
    name = 'ApprovedForPaymentInInfringementStatusEnum1613984567121';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // to check if trigger already exists and skip if that's the case drop it the trigger
        const triggerExists = await queryRunner.query(
            `select tgname from pg_trigger where tgname = 'infringement_status_last_change_date';`,
        );
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            await queryRunner.query(`DROP TRIGGER infringement_status_last_change_date on "infringement"`);
        }

        // then run migration to update status enum
        await queryRunner.query(`ALTER TYPE "public"."infringement_status_enum" RENAME TO "infringement_status_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "infringement_status_enum" AS ENUM('Due', 'Outstanding', 'Paid', 'Closed', 'Approved for Payment')`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ALTER COLUMN "status" TYPE "infringement_status_enum" USING "status"::"text"::"infringement_status_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "status" SET DEFAULT 'Due'`);
        await queryRunner.query(`DROP TYPE "infringement_status_enum_old"`);

        // Lastly create trigger again if it existed in the first place
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            await queryRunner.query(`
            CREATE OR REPLACE FUNCTION process_infringement_status_last_change_date()
            RETURNS TRIGGER AS $infringement_status_last_change_date$
            BEGIN
                UPDATE infringement SET "lastStatusChangeDate" = CURRENT_TIMESTAMP WHERE "infringementId" = NEW."infringementId";
                    RETURN NEW;
                END;
            $infringement_status_last_change_date$ LANGUAGE plpgsql;

            CREATE TRIGGER infringement_status_last_change_date
                AFTER UPDATE ON infringement
                FOR EACH ROW
                WHEN (OLD.status IS DISTINCT FROM NEW.status)
                EXECUTE PROCEDURE process_infringement_status_last_change_date();
        `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // to check if trigger already exists and skip if that's the case drop it the trigger
        const triggerExists = await queryRunner.query(
            `select tgname from pg_trigger where tgname = 'infringement_status_last_change_date';`,
        );
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            await queryRunner.query(`DROP TRIGGER infringement_status_last_change_date on "infringement"`);
        }

        // change enum back
        await queryRunner.query(`CREATE TYPE "infringement_status_enum_old" AS ENUM('Due', 'Outstanding', 'Paid', 'Closed')`);
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ALTER COLUMN "status" TYPE "infringement_status_enum_old" USING "status"::"text"::"infringement_status_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ALTER COLUMN "status" SET DEFAULT 'Due'`);
        await queryRunner.query(`DROP TYPE "infringement_status_enum"`);
        await queryRunner.query(`ALTER TYPE "infringement_status_enum_old" RENAME TO  "infringement_status_enum"`);

        // Lastly create trigger again if it existed in the first place
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            await queryRunner.query(`
            CREATE OR REPLACE FUNCTION process_infringement_status_last_change_date()
            RETURNS TRIGGER AS $infringement_status_last_change_date$
            BEGIN
                UPDATE infringement SET "lastStatusChangeDate" = CURRENT_TIMESTAMP WHERE "infringementId" = NEW."infringementId";
                    RETURN NEW;
                END;
            $infringement_status_last_change_date$ LANGUAGE plpgsql;

            CREATE TRIGGER infringement_status_last_change_date
                AFTER UPDATE ON infringement
                FOR EACH ROW
                WHEN (OLD.status IS DISTINCT FROM NEW.status)
                EXECUTE PROCEDURE process_infringement_status_last_change_date();
        `);
        }
    }
}
