import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInfringementApprovalTable1616074139924 implements MigrationInterface {
    name = 'AddInfringementApprovalTable1616074139924';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "infringement_approval_action_enum" AS ENUM('Approve For Payment', 'Unapprove for Payment')`);
        await queryRunner.query(
            `CREATE TABLE "infringement_approval" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "infringementApprovalId" SERIAL NOT NULL, "action" "infringement_approval_action_enum" NOT NULL, "actionDate" TIMESTAMP WITH TIME ZONE, "amountDue" numeric(12,2) NOT NULL, "infringementId" integer, "accountId" integer, "userId" integer, CONSTRAINT "PK_c975455040d27966b8a35e58f8c" PRIMARY KEY ("infringementApprovalId"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_c975455040d27966b8a35e58f8" ON "infringement_approval" ("infringementApprovalId") `,
        );
        await queryRunner.query(`CREATE INDEX "IDX_7b6567af45f8fe57be317580a8" ON "infringement_approval" ("infringementId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6f888aab74ed4d0457bf128fe9" ON "infringement_approval" ("actionDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_d3ffa4a0d9babc0c9b8e05fe90" ON "infringement_approval" ("amountDue") `);
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "ocr" SET DEFAULT null`);
        await queryRunner.query(
            `ALTER TABLE "infringement_approval" ADD CONSTRAINT "FK_7b6567af45f8fe57be317580a8b" FOREIGN KEY ("infringementId") REFERENCES "infringement"("infringementId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "infringement_approval" ADD CONSTRAINT "FK_54e48826f53700a99bca1c42df8" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "infringement_approval" ADD CONSTRAINT "FK_021ba8a6b502b2bf9ff96905473" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement_approval" DROP CONSTRAINT "FK_021ba8a6b502b2bf9ff96905473"`);
        await queryRunner.query(`ALTER TABLE "infringement_approval" DROP CONSTRAINT "FK_54e48826f53700a99bca1c42df8"`);
        await queryRunner.query(`ALTER TABLE "infringement_approval" DROP CONSTRAINT "FK_7b6567af45f8fe57be317580a8b"`);
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "ocr" DROP DEFAULT`);
        await queryRunner.query(`DROP INDEX "IDX_d3ffa4a0d9babc0c9b8e05fe90"`);
        await queryRunner.query(`DROP INDEX "IDX_6f888aab74ed4d0457bf128fe9"`);
        await queryRunner.query(`DROP INDEX "IDX_7b6567af45f8fe57be317580a8"`);
        await queryRunner.query(`DROP INDEX "IDX_c975455040d27966b8a35e58f8"`);
        await queryRunner.query(`DROP TABLE "infringement_approval"`);
        await queryRunner.query(`DROP TYPE "infringement_approval_action_enum"`);
    }
}
