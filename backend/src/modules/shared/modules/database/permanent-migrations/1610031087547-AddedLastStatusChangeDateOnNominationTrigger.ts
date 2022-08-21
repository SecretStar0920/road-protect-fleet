import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLastStatusChangeDateOnNominationTrigger1610031087547 implements MigrationInterface {
    name = 'AddedLastStatusChangeDateOnNominationTrigger1610031087547';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // I'd rather not keep replacing the trigger on live so this allows me
        // to check if it already exists and skip if that's the case.
        const triggerExists = await queryRunner.query(`select tgname from pg_trigger where tgname = 'nomination_status_last_date_change';`);
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            return;
        }
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE TRIGGER nomination_status_last_date_change`);
    }
}
