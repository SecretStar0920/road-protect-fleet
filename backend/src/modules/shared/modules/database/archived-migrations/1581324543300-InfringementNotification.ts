import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementNotification1581324543300 implements MigrationInterface {
    name = 'InfringementNotification1581324543300';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "notification" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "notificationId" SERIAL NOT NULL, "message" text NOT NULL, "accountId" integer, "infringementId" integer, CONSTRAINT "PK_34ecf236e96be76a41929c131b7" PRIMARY KEY ("notificationId"))`,
            undefined,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_34ecf236e96be76a41929c131b" ON "notification" ("notificationId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_00abcf7b2089a5c05f0aedc567" ON "notification" ("accountId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_42e70487eae87c1ef1e00a9135" ON "notification" ("infringementId") `, undefined);
        await queryRunner.query(
            `ALTER TABLE "notification" ADD CONSTRAINT "FK_00abcf7b2089a5c05f0aedc5676" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "notification" ADD CONSTRAINT "FK_42e70487eae87c1ef1e00a91358" FOREIGN KEY ("infringementId") REFERENCES "infringement"("infringementId") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_42e70487eae87c1ef1e00a91358"`, undefined);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_00abcf7b2089a5c05f0aedc5676"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_42e70487eae87c1ef1e00a9135"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_00abcf7b2089a5c05f0aedc567"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_34ecf236e96be76a41929c131b"`, undefined);
        await queryRunner.query(`DROP TABLE "notification"`, undefined);
    }
}
