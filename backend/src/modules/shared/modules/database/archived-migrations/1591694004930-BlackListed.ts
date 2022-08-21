import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlackListed1591694004930 implements MigrationInterface {
    name = 'BlackListed1591694004930';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "blacklisted_action" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "action" text NOT NULL, CONSTRAINT "PK_f0d9acfbc7bb948db2da845ec64" PRIMARY KEY ("action"))`,
            undefined,
        );
        await queryRunner.query(`CREATE INDEX "IDX_f0d9acfbc7bb948db2da845ec6" ON "blacklisted_action" ("action") `, undefined);

        await queryRunner.query(
            `CREATE TABLE "account_user_blacklisted_actions" ("accountUserAccountUserId" integer NOT NULL, "blacklistedActionAction" text NOT NULL, CONSTRAINT "PK_9ae72686d26180e1d970920a606" PRIMARY KEY ("accountUserAccountUserId", "blacklistedActionAction"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_bb162404e9eaa90240610e4c82" ON "account_user_blacklisted_actions" ("accountUserAccountUserId") `,
            undefined,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_cac89b503195f3d51bc3e8d8d7" ON "account_user_blacklisted_actions" ("blacklistedActionAction") `,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account_user_blacklisted_actions" ADD CONSTRAINT "FK_bb162404e9eaa90240610e4c826" FOREIGN KEY ("accountUserAccountUserId") REFERENCES "account_user"("accountUserId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account_user_blacklisted_actions" ADD CONSTRAINT "FK_cac89b503195f3d51bc3e8d8d7e" FOREIGN KEY ("blacklistedActionAction") REFERENCES "blacklisted_action"("action") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account_user_blacklisted_actions" DROP CONSTRAINT "FK_cac89b503195f3d51bc3e8d8d7e"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "account_user_blacklisted_actions" DROP CONSTRAINT "FK_bb162404e9eaa90240610e4c826"`,
            undefined,
        );
        await queryRunner.query(`DROP INDEX "IDX_cac89b503195f3d51bc3e8d8d7"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_bb162404e9eaa90240610e4c82"`, undefined);
        await queryRunner.query(`DROP TABLE "account_user_blacklisted_actions"`, undefined);
    }
}
