import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIntegrationRequestLogTable1605261841551 implements MigrationInterface {
    name = 'CreateIntegrationRequestLogTable1605261841551';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "integration_request_log_type_enum" AS ENUM('AUTOMATION_ADD_VEHICLE', 'AUTOMATION_CREDIT_GUARD_PAY', 'AUTOMATION_CREDIT_GUARD_REQUEST_TOKEN', 'AUTOMATION_REDIRECT_INFRINGEMENT', 'AUTOMATION_UPDATE_VEHICLE', 'AUTOMATION_VERIFY_INFRINGEMENT', 'AUTOMATION_VERIFY_INFRINGEMENT_SUM', 'ISRAEL_GOVERNMENT_LOCALITIES', 'ISRAEL_GOVERNMENT_STREET_CODES', 'ITURAN_VEHICLE_LOCATION', 'OLD_FLEET_INFRINGEMENT_DATA', 'RP_CREDIT_GUARD_REQUEST_TOKEN', 'RP_CREDIT_GUARD_PAY')`,
        );
        await queryRunner.query(
            `CREATE TABLE "integration_request_log" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "integrationRequestLogId" SERIAL NOT NULL, "success" boolean NOT NULL DEFAULT true, "request" jsonb NOT NULL DEFAULT '{}', "response" jsonb NOT NULL DEFAULT '{}', "details" jsonb NOT NULL DEFAULT '{}', "type" "integration_request_log_type_enum" NOT NULL, CONSTRAINT "PK_f06bac158f41418deb405ea34ad" PRIMARY KEY ("integrationRequestLogId"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_f06bac158f41418deb405ea34a" ON "integration_request_log" ("integrationRequestLogId") `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_f06bac158f41418deb405ea34a"`);
        await queryRunner.query(`DROP TABLE "integration_request_log"`);
        await queryRunner.query(`DROP TYPE "integration_request_log_type_enum"`);
    }
}
