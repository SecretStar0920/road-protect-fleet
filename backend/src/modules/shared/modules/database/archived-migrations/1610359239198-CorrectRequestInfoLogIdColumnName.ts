import { MigrationInterface, QueryRunner } from 'typeorm';

export class CorrectRequestInfoLogIdColumnName1610359239198 implements MigrationInterface {
    name = 'CorrectRequestInfoLogIdColumnName1610359239198';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "request_information_log" RENAME COLUMN "informationRequestLogId" TO "requestInformationLogId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "request_information_log" RENAME CONSTRAINT "PK_b1654bbfbb46288512c45e1971a" TO "PK_63d2680ef35b07d79eb82822501"`,
        );
        await queryRunner.query(
            `ALTER SEQUENCE "request_information_log_informationRequestLogId_seq" RENAME TO "request_information_log_requestInformationLogId_seq"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER SEQUENCE "request_information_log_requestInformationLogId_seq" RENAME TO "request_information_log_informationRequestLogId_seq"`,
        );
        await queryRunner.query(
            `ALTER TABLE "request_information_log" RENAME CONSTRAINT "PK_63d2680ef35b07d79eb82822501" TO "PK_b1654bbfbb46288512c45e1971a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "request_information_log" RENAME COLUMN "requestInformationLogId" TO "informationRequestLogId"`,
        );
    }
}
