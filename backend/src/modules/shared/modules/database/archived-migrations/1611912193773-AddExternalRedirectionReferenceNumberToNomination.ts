import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExternalRedirectionReferenceNumberToNomination1611912193773 implements MigrationInterface {
    name = 'AddExternalRedirectionReferenceNumberToNomination1611912193773';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nomination" ADD "externalRedirectionReference" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nomination" DROP COLUMN "externalRedirectionReference"`);
    }
}
