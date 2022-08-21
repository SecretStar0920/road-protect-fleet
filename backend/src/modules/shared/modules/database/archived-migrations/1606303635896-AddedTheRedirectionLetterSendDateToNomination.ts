import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTheRedirectionLetterSendDateToNomination1606303635896 implements MigrationInterface {
    name = 'AddedTheRedirectionLetterSendDateToNomination1606303635896';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nomination" ADD "redirectionLetterSendDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_caddf3f8fa19e6ae143467a99b" ON "nomination" ("redirectionLetterSendDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_caddf3f8fa19e6ae143467a99b"`);
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "redirectionLetterSendDate"`);
    }
}
