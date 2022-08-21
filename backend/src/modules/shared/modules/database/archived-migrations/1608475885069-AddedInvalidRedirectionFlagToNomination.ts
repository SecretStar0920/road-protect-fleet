import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedInvalidRedirectionFlagToNomination1608475885069 implements MigrationInterface {
    name = 'AddedInvalidRedirectionFlagToNomination1608475885069';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nomination" ADD "invalidRedirection" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "invalidRedirection"`);
    }
}
