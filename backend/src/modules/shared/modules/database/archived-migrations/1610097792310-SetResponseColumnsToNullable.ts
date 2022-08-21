import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetResponseColumnsToNullable1610097792310 implements MigrationInterface {
    name = 'SetResponseColumnsToNullable1610097792310';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_information_log" ALTER COLUMN "responseReceivedDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request_information_log" ALTER COLUMN "responseReceived" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_information_log" ALTER COLUMN "responseReceived" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request_information_log" ALTER COLUMN "responseReceivedDate" SET NOT NULL`);
    }
}
