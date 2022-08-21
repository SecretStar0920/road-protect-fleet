import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedNoticeNumberAndIssuerToRawInfringement1604317431953 implements MigrationInterface {
    name = 'AddedNoticeNumberAndIssuerToRawInfringement1604317431953';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raw_infringement" ADD "noticeNumber" text`);
        await queryRunner.query(`ALTER TABLE "raw_infringement" ADD "issuer" text`);

        await queryRunner.query(`UPDATE raw_infringement SET "noticeNumber" = coalesce("data"->>'ticketNumber', "data"->>'fine_id')`);
        await queryRunner.query(
            `UPDATE raw_infringement SET "issuer" = coalesce("data"->>'customer', (substring("data"->>'fine_seq', 1, 5)::int - 10000)::text);`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raw_infringement" DROP COLUMN "issuer"`);
        await queryRunner.query(`ALTER TABLE "raw_infringement" DROP COLUMN "noticeNumber"`);
    }
}
