import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountRelationEntity1582794537402 implements MigrationInterface {
    name = 'AccountRelationEntity1582794537402';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "account_relation" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "accountRelationId" SERIAL NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', "forwardAccountId" integer NOT NULL, "reverseAccountId" integer NOT NULL, CONSTRAINT "PK_022ab023bf13b99039b389b7b60" PRIMARY KEY ("accountRelationId"))`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account_relation" ADD CONSTRAINT "FK_a85cb73c8fe88457749268b4821" FOREIGN KEY ("forwardAccountId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account_relation" ADD CONSTRAINT "FK_ab62664f62d2545c0e5a12bdeaa" FOREIGN KEY ("reverseAccountId") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account_relation" DROP CONSTRAINT "FK_ab62664f62d2545c0e5a12bdeaa"`, undefined);
        await queryRunner.query(`ALTER TABLE "account_relation" DROP CONSTRAINT "FK_a85cb73c8fe88457749268b4821"`, undefined);
        await queryRunner.query(`DROP TABLE "account_relation"`, undefined);
    }
}
