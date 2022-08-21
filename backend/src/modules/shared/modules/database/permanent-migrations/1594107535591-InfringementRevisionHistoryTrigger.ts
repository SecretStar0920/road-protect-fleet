import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementRevisionHistoryTrigger1594107535591 implements MigrationInterface {
    name = 'InfringementRevisionHistoryTrigger1594107535591';
    public async up(queryRunner: QueryRunner): Promise<any> {
        // I'd rather not keep replacing the trigger on live so this allows me
        // to check if it already exists and skip if that's the case.
        const triggerExists = await queryRunner.query(`select tgname from pg_trigger where tgname = 'infringement_revision_history';`);
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            return;
        }
        await queryRunner.query(`
        CREATE OR REPLACE FUNCTION process_infringement_revision_history() RETURNS TRIGGER AS $infringement_revision_history$
            BEGIN
                --
                -- Create a row in infringement_revision_history to reflect the operation performed on infringement,
                -- make use of the special variable TG_OP to work out the operation.
                --
                IF (TG_OP = 'DELETE') THEN
                    INSERT INTO public.infringement_revision_history ("infringementId", "action", "old", "new", "timestamp") VALUES(old."infringementId", 'DELETE', row_to_json(old.*), row_to_json(new.*), CURRENT_TIMESTAMP);
                    RETURN OLD;
                ELSIF (TG_OP = 'UPDATE') THEN
                    INSERT INTO public.infringement_revision_history ("infringementId", "action", "old", "new", "timestamp") VALUES(old."infringementId", 'UPDATE', row_to_json(old.*), row_to_json(new.*), CURRENT_TIMESTAMP);
                    RETURN NEW;
                ELSIF (TG_OP = 'INSERT') THEN
                    INSERT INTO public.infringement_revision_history ("infringementId", "action", "old", "new", "timestamp") VALUES(new."infringementId", 'INSERT', row_to_json(old.*), row_to_json(new.*), CURRENT_TIMESTAMP);
                    RETURN NEW;
                END IF;
                RETURN NULL; -- result is ignored since this is an AFTER trigger
            END;
        $infringement_revision_history$ LANGUAGE plpgsql;

        CREATE TRIGGER infringement_revision_history
        AFTER INSERT OR UPDATE OR DELETE ON infringement
            FOR EACH ROW EXECUTE PROCEDURE process_infringement_revision_history();`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE TRIGGER infringement_revision_history`);
    }
}
