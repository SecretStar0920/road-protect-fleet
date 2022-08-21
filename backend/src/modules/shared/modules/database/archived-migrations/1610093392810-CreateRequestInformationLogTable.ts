import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRequestInformationLogTable1610093392810 implements MigrationInterface {
    name = 'CreateRequestInformationLogTable1610093392810';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "request_information_log" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "informationRequestLogId" SERIAL NOT NULL, "requestSendDate" TIMESTAMP WITH TIME ZONE NOT NULL, "responseReceivedDate" TIMESTAMP WITH TIME ZONE NOT NULL, "responseReceived" boolean NOT NULL DEFAULT false, "details" jsonb NOT NULL DEFAULT '{}', "accountId" integer, "issuerId" integer, CONSTRAINT "PK_b1654bbfbb46288512c45e1971a" PRIMARY KEY ("informationRequestLogId"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_5c96642baf5c0f68eb017710aa" ON "request_information_log" ("accountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cbc19f8ffef47d38e41f2fb348" ON "request_information_log" ("issuerId") `);
        await queryRunner.query(
            `ALTER TABLE "request_information_log" ADD CONSTRAINT "FK_5c96642baf5c0f68eb017710aaf" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "request_information_log" ADD CONSTRAINT "FK_cbc19f8ffef47d38e41f2fb3486" FOREIGN KEY ("issuerId") REFERENCES "issuer"("issuerId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_information_log" DROP CONSTRAINT "FK_cbc19f8ffef47d38e41f2fb3486"`);
        await queryRunner.query(`ALTER TABLE "request_information_log" DROP CONSTRAINT "FK_5c96642baf5c0f68eb017710aaf"`);
        await queryRunner.query(`DROP INDEX "IDX_cbc19f8ffef47d38e41f2fb348"`);
        await queryRunner.query(`DROP INDEX "IDX_5c96642baf5c0f68eb017710aa"`);
        await queryRunner.query(`DROP TABLE "request_information_log"`);
    }
}
