import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLastStatusChangeDateOnInfringementTrigger1610031075501 implements MigrationInterface {
    name = 'AddedLastStatusChangeDateOnInfringementTrigger1610031075501';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // I'd rather not keep replacing the trigger on live so this allows me
        // to check if it already exists and skip if that's the case.
        const triggerExists = await queryRunner.query(
            `select tgname from pg_trigger where tgname = 'infringement_status_last_change_date';`,
        );
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            return;
        }
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE TRIGGER infringement_status_last_change_date`);
    }
}
