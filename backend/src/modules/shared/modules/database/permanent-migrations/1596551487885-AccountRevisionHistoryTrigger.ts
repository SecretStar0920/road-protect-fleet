import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountRevisionHistoryTrigger1596551487885 implements MigrationInterface {
    name = 'AccountRevisionHistoryTrigger1596551487885';
    public async up(queryRunner: QueryRunner): Promise<any> {
        // I'd rather not keep replacing the trigger on live so this allows me
        // to check if it already exists and skip if that's the case.
        const triggerExists = await queryRunner.query(`select tgname from pg_trigger where tgname = 'account_revision_history';`);
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            return;
        }
        await queryRunner.query(`
        CREATE OR REPLACE FUNCTION process_account_revision_history() RETURNS TRIGGER AS $account_revision_history$
            BEGIN
                --
                -- Create a row in account_revision_history to reflect the operation performed on account,
                -- make use of the special variable TG_OP to work out the operation.
                --
                IF (TG_OP = 'DELETE') THEN
                    INSERT INTO public.account_revision_history ("accountId", "action", "old", "new", "timestamp") VALUES(old."accountId", 'DELETE', row_to_json(old.*), row_to_json(new.*), CURRENT_TIMESTAMP);
                    RETURN OLD;
                ELSIF (TG_OP = 'UPDATE') THEN
                    INSERT INTO public.account_revision_history ("accountId", "action", "old", "new", "timestamp") VALUES(old."accountId", 'UPDATE', row_to_json(old.*), row_to_json(new.*), CURRENT_TIMESTAMP);
                    RETURN NEW;
                ELSIF (TG_OP = 'INSERT') THEN
                    INSERT INTO public.account_revision_history ("accountId", "action", "old", "new", "timestamp") VALUES(new."accountId", 'INSERT', row_to_json(old.*), row_to_json(new.*), CURRENT_TIMESTAMP);
                    RETURN NEW;
                END IF;
                RETURN NULL; -- result is ignored since this is an AFTER trigger
            END;
        $account_revision_history$ LANGUAGE plpgsql;

        CREATE TRIGGER account_revision_history
        AFTER INSERT OR UPDATE OR DELETE ON account
            FOR EACH ROW EXECUTE PROCEDURE process_account_revision_history();`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE TRIGGER account_revision_history`);
    }
}
