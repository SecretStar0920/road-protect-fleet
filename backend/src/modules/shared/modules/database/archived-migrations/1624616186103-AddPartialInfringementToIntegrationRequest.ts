import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartialInfringementToIntegrationRequest1624616186103 implements MigrationInterface {
    name = 'AddPartialInfringementToIntegrationRequest1624616186103';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."integration_request_log_type_enum" RENAME TO "integration_request_log_type_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "integration_request_log_type_enum" AS ENUM('AUTOMATION_ADD_VEHICLE', 'AUTOMATION_CREDIT_GUARD_PAY', 'AUTOMATION_CREDIT_GUARD_REQUEST_TOKEN', 'AUTOMATION_REDIRECT_INFRINGEMENT', 'AUTOMATION_UPDATE_VEHICLE', 'AUTOMATION_VERIFY_INFRINGEMENT', 'AUTOMATION_VERIFY_INFRINGEMENT_SUM', 'ISRAEL_GOVERNMENT_LOCALITIES', 'ISRAEL_GOVERNMENT_STREET_CODES', 'ITURAN_VEHICLE_LOCATION', 'OLD_FLEET_INFRINGEMENT_DATA', 'RP_CREDIT_GUARD_REQUEST_TOKEN', 'RP_CREDIT_GUARD_PAY', 'JERUSALEM_VERIFY_INFRINGEMENT', 'TELAVIV_VERIFY_INFRINGEMENT', 'MILEON_VERIFY_INFRINGEMENT', 'MELGAM_VERIFY_INFRINGEMENT', 'POLICE_VERIFY_INFRINGEMENT', 'SHOHAR_VERIFY_INFRINGEMENT', 'CONTRACT_OCR', 'TELAVIV_REDIRECT_INFRINGEMENT', 'JERUSALEM_REDIRECT_INFRINGEMENT', 'POLICE_REDIRECT_INFRINGEMENT', 'MILEON_REDIRECT_INFRINGEMENT', 'PARTIAL_INFRINGEMENT')`,
        );
        await queryRunner.query(
            `ALTER TABLE "integration_request_log" ALTER COLUMN "type" TYPE "integration_request_log_type_enum" USING "type"::"text"::"integration_request_log_type_enum"`,
        );
        await queryRunner.query(`DROP TYPE "integration_request_log_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "integration_request_log_type_enum_old" AS ENUM('AUTOMATION_ADD_VEHICLE', 'AUTOMATION_CREDIT_GUARD_PAY', 'AUTOMATION_CREDIT_GUARD_REQUEST_TOKEN', 'AUTOMATION_REDIRECT_INFRINGEMENT', 'AUTOMATION_UPDATE_VEHICLE', 'AUTOMATION_VERIFY_INFRINGEMENT', 'AUTOMATION_VERIFY_INFRINGEMENT_SUM', 'CONTRACT_OCR', 'ISRAEL_GOVERNMENT_LOCALITIES', 'ISRAEL_GOVERNMENT_STREET_CODES', 'ITURAN_VEHICLE_LOCATION', 'JERUSALEM_REDIRECT_INFRINGEMENT', 'JERUSALEM_VERIFY_INFRINGEMENT', 'MELGAM_VERIFY_INFRINGEMENT', 'MILEON_REDIRECT_INFRINGEMENT', 'MILEON_VERIFY_INFRINGEMENT', 'OLD_FLEET_INFRINGEMENT_DATA', 'POLICE_REDIRECT_INFRINGEMENT', 'POLICE_VERIFY_INFRINGEMENT', 'RP_CREDIT_GUARD_PAY', 'RP_CREDIT_GUARD_REQUEST_TOKEN', 'SHOHAR_VERIFY_INFRINGEMENT', 'TELAVIV_REDIRECT_INFRINGEMENT', 'TELAVIV_VERIFY_INFRINGEMENT')`,
        );
        await queryRunner.query(
            `ALTER TABLE "integration_request_log" ALTER COLUMN "type" TYPE "integration_request_log_type_enum_old" USING "type"::"text"::"integration_request_log_type_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "integration_request_log_type_enum"`);
        await queryRunner.query(`ALTER TYPE "integration_request_log_type_enum_old" RENAME TO  "integration_request_log_type_enum"`);
    }
}
