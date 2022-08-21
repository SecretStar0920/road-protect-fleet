import { MigrationInterface, QueryRunner } from 'typeorm';
import { IssuerIntegrationType } from '@modules/shared/models/issuer-integration-details.model';
import { InfringementVerificationProvider } from '@config/infringement';

const nameCodeMapping = {
    'לב השרון': '38',
    נתיבות: '40',
    'קרית ביאליק': '49',
    ערד: '39',
    'קרני שומרון': '42',
    עפולה: '29',
    'באר יעקב': '48',
    'קרית מלאכי': '7',
    'קרית אונו': '14',
};

export class ShoharExternalCodes1610614916611 implements MigrationInterface {
    name = 'ShoharExternalCodes1610614916611';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."integration_request_log_type_enum" RENAME TO "integration_request_log_type_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "integration_request_log_type_enum" AS ENUM('AUTOMATION_ADD_VEHICLE', 'AUTOMATION_CREDIT_GUARD_PAY', 'AUTOMATION_CREDIT_GUARD_REQUEST_TOKEN', 'AUTOMATION_REDIRECT_INFRINGEMENT', 'AUTOMATION_UPDATE_VEHICLE', 'AUTOMATION_VERIFY_INFRINGEMENT', 'AUTOMATION_VERIFY_INFRINGEMENT_SUM', 'ISRAEL_GOVERNMENT_LOCALITIES', 'ISRAEL_GOVERNMENT_STREET_CODES', 'ITURAN_VEHICLE_LOCATION', 'OLD_FLEET_INFRINGEMENT_DATA', 'RP_CREDIT_GUARD_REQUEST_TOKEN', 'RP_CREDIT_GUARD_PAY', 'JERUSALEM_VERIFY_INFRINGEMENT', 'TELAVIV_VERIFY_INFRINGEMENT', 'MILEON_VERIFY_INFRINGEMENT', 'MELGAM_VERIFY_INFRINGEMENT', 'POLICE_VERIFY_INFRINGEMENT', 'SHOHAR_VERIFY_INFRINGEMENT')`,
        );
        await queryRunner.query(
            `ALTER TABLE "integration_request_log" ALTER COLUMN "type" TYPE "integration_request_log_type_enum" USING "type"::"text"::"integration_request_log_type_enum"`,
        );
        await queryRunner.query(`DROP TYPE "integration_request_log_type_enum_old"`);

        for (const [name, code] of Object.entries(nameCodeMapping)) {
            const shoharIssuers = await queryRunner.query(`SELECT * FROM issuer WHERE "name"='${name}'`);
            for (const issuer of shoharIssuers) {
                const externalCode = code;
                if (externalCode) {
                    const integrationDetails = {
                        ...issuer.integrationDetails,
                        type: IssuerIntegrationType.Shohar,
                        verificationProvider: InfringementVerificationProvider.Shohar,
                        code: externalCode,
                    };
                    await queryRunner.query(
                        `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(
                            integrationDetails,
                        )}', "provider"='Shohar'  WHERE "issuerId"=${issuer.issuerId}`,
                    );
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "integration_request_log_type_enum_old" AS ENUM('AUTOMATION_ADD_VEHICLE', 'AUTOMATION_CREDIT_GUARD_PAY', 'AUTOMATION_CREDIT_GUARD_REQUEST_TOKEN', 'AUTOMATION_REDIRECT_INFRINGEMENT', 'AUTOMATION_UPDATE_VEHICLE', 'AUTOMATION_VERIFY_INFRINGEMENT', 'AUTOMATION_VERIFY_INFRINGEMENT_SUM', 'ISRAEL_GOVERNMENT_LOCALITIES', 'ISRAEL_GOVERNMENT_STREET_CODES', 'ITURAN_VEHICLE_LOCATION', 'JERUSALEM_VERIFY_INFRINGEMENT', 'MELGAM_VERIFY_INFRINGEMENT', 'MILEON_VERIFY_INFRINGEMENT', 'OLD_FLEET_INFRINGEMENT_DATA', 'POLICE_VERIFY_INFRINGEMENT', 'RP_CREDIT_GUARD_PAY', 'RP_CREDIT_GUARD_REQUEST_TOKEN', 'TELAVIV_VERIFY_INFRINGEMENT')`,
        );
        await queryRunner.query(
            `ALTER TABLE "integration_request_log" ALTER COLUMN "type" TYPE "integration_request_log_type_enum_old" USING "type"::"text"::"integration_request_log_type_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "integration_request_log_type_enum"`);
        await queryRunner.query(`ALTER TYPE "integration_request_log_type_enum_old" RENAME TO  "integration_request_log_type_enum"`);
    }
}
