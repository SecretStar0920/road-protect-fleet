import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMileonRedirection1616078538005 implements MigrationInterface {
    name = 'createMileonRedirection1616078538005';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."nomination_redirectiontype_enum" RENAME TO "nomination_redirectiontype_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "nomination_redirectiontype_enum" AS ENUM('Manual Email', 'ATG Integration', 'Manual Upload', 'External', 'Telaviv', 'Jerusalem', 'Police', 'Mileon')`,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum" USING "redirectionType"::"text"::"nomination_redirectiontype_enum"`,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum_old"`);
        await queryRunner.query(
            `ALTER TYPE "public"."integration_request_log_type_enum" RENAME TO "integration_request_log_type_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "integration_request_log_type_enum" AS ENUM('AUTOMATION_ADD_VEHICLE', 'AUTOMATION_CREDIT_GUARD_PAY', 'AUTOMATION_CREDIT_GUARD_REQUEST_TOKEN', 'AUTOMATION_REDIRECT_INFRINGEMENT', 'AUTOMATION_UPDATE_VEHICLE', 'AUTOMATION_VERIFY_INFRINGEMENT', 'AUTOMATION_VERIFY_INFRINGEMENT_SUM', 'ISRAEL_GOVERNMENT_LOCALITIES', 'ISRAEL_GOVERNMENT_STREET_CODES', 'ITURAN_VEHICLE_LOCATION', 'OLD_FLEET_INFRINGEMENT_DATA', 'RP_CREDIT_GUARD_REQUEST_TOKEN', 'RP_CREDIT_GUARD_PAY', 'JERUSALEM_VERIFY_INFRINGEMENT', 'TELAVIV_VERIFY_INFRINGEMENT', 'MILEON_VERIFY_INFRINGEMENT', 'MELGAM_VERIFY_INFRINGEMENT', 'POLICE_VERIFY_INFRINGEMENT', 'SHOHAR_VERIFY_INFRINGEMENT', 'CONTRACT_OCR', 'TELAVIV_REDIRECT_INFRINGEMENT', 'JERUSALEM_REDIRECT_INFRINGEMENT', 'POLICE_REDIRECT_INFRINGEMENT', 'MILEON_REDIRECT_INFRINGEMENT')`,
        );
        await queryRunner.query(
            `ALTER TABLE "integration_request_log" ALTER COLUMN "type" TYPE "integration_request_log_type_enum" USING "type"::"text"::"integration_request_log_type_enum"`,
        );
        await queryRunner.query(`DROP TYPE "integration_request_log_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "integration_request_log_type_enum_old" AS ENUM('AUTOMATION_ADD_VEHICLE', 'AUTOMATION_CREDIT_GUARD_PAY', 'AUTOMATION_CREDIT_GUARD_REQUEST_TOKEN', 'AUTOMATION_REDIRECT_INFRINGEMENT', 'AUTOMATION_UPDATE_VEHICLE', 'AUTOMATION_VERIFY_INFRINGEMENT', 'AUTOMATION_VERIFY_INFRINGEMENT_SUM', 'ISRAEL_GOVERNMENT_LOCALITIES', 'ISRAEL_GOVERNMENT_STREET_CODES', 'ITURAN_VEHICLE_LOCATION', 'OLD_FLEET_INFRINGEMENT_DATA', 'RP_CREDIT_GUARD_REQUEST_TOKEN', 'RP_CREDIT_GUARD_PAY', 'JERUSALEM_VERIFY_INFRINGEMENT', 'TELAVIV_VERIFY_INFRINGEMENT', 'MILEON_VERIFY_INFRINGEMENT', 'MELGAM_VERIFY_INFRINGEMENT', 'POLICE_VERIFY_INFRINGEMENT', 'SHOHAR_VERIFY_INFRINGEMENT', 'CONTRACT_OCR', 'TELAVIV_REDIRECT_INFRINGEMENT', 'JERUSALEM_REDIRECT_INFRINGEMENT', 'POLICE_REDIRECT_INFRINGEMENT')`,
        );
        await queryRunner.query(
            `ALTER TABLE "integration_request_log" ALTER COLUMN "type" TYPE "integration_request_log_type_enum_old" USING "type"::"text"::"integration_request_log_type_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "integration_request_log_type_enum"`);
        await queryRunner.query(`ALTER TYPE "integration_request_log_type_enum_old" RENAME TO  "integration_request_log_type_enum"`);
        await queryRunner.query(
            `CREATE TYPE "nomination_redirectiontype_enum_old" AS ENUM('Manual Email', 'ATG Integration', 'Manual Upload', 'External', 'Telaviv', 'Jerusalem', 'Police')`,
        );
        await queryRunner.query(
            `ALTER TABLE "nomination" ALTER COLUMN "redirectionType" TYPE "nomination_redirectiontype_enum_old" USING "redirectionType"::"text"::"nomination_redirectiontype_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "nomination_redirectiontype_enum"`);
        await queryRunner.query(`ALTER TYPE "nomination_redirectiontype_enum_old" RENAME TO  "nomination_redirectiontype_enum"`);
    }
}
