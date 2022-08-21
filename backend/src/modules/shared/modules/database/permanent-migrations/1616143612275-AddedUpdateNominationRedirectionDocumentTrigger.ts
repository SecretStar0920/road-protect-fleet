import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUpdateNominationRedirectionDocumentTrigger1616143612275 implements MigrationInterface {
    name = 'AddedUpdateNominationRedirectionDocumentTrigger1616143612275';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // I'd rather not keep replacing the trigger on live so this allows me
        // to check if it already exists and skip if that's the case.
        const triggerExists = await queryRunner.query(
            `select tgname from pg_trigger where tgname = 'nomination_merged_document_change_date';`,
        );
        if (Array.isArray(triggerExists) && triggerExists.length > 0) {
            return;
        }
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION process_nomination_merged_document_change_date()
                RETURNS TRIGGER AS $nomination_merged_document_change_date$
                BEGIN
                    UPDATE nomination SET "mergedDocumentUpdatedDate" = CURRENT_TIMESTAMP WHERE "nominationId" = NEW."nominationId";
                    RETURN NEW;
                END;
            $nomination_merged_document_change_date$ LANGUAGE plpgsql;

            CREATE TRIGGER nomination_merged_document_change_date
                AFTER UPDATE ON nomination
                FOR EACH ROW
                WHEN (OLD."documentId" IS DISTINCT FROM NEW."documentId")
                EXECUTE PROCEDURE process_nomination_merged_document_change_date();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER nomination_merged_document_change_date ON nomination`);
    }
}
