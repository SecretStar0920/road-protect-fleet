import { MigrationInterface, QueryRunner } from 'typeorm';

export class TokenTableRefactor1587387612322 implements MigrationInterface {
    name = 'TokenTableRefactor1587387612322';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "credit_guard_token" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "creditGuardTokenId" SERIAL NOT NULL, "cardToken" text, "cardExp" text, "cardMask" text, "cardHolderId" text, "raw" jsonb, CONSTRAINT "PK_fbdec8ed0160f6fee518ef7726e" PRIMARY KEY ("creditGuardTokenId"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_fbdec8ed0160f6fee518ef7726" ON "credit_guard_token" ("creditGuardTokenId") `,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "atgPayment"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "atgTokenId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_89316e528062ec22a856e91ac7c" UNIQUE ("atgTokenId")`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "rpTokenId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_1d317649b51fec56e8ee2c924b5" UNIQUE ("rpTokenId")`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" SET DEFAULT null`, undefined);
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_89316e528062ec22a856e91ac7c" FOREIGN KEY ("atgTokenId") REFERENCES "credit_guard_token"("creditGuardTokenId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_1d317649b51fec56e8ee2c924b5" FOREIGN KEY ("rpTokenId") REFERENCES "credit_guard_token"("creditGuardTokenId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_1d317649b51fec56e8ee2c924b5"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_89316e528062ec22a856e91ac7c"`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" SET DEFAULT '{"type": "None"}'`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_1d317649b51fec56e8ee2c924b5"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "rpTokenId"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_89316e528062ec22a856e91ac7c"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "atgTokenId"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "atgPayment" jsonb NOT NULL DEFAULT '{}'`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_fbdec8ed0160f6fee518ef7726"`, undefined);
        await queryRunner.query(`DROP TABLE "credit_guard_token"`, undefined);
    }
}
