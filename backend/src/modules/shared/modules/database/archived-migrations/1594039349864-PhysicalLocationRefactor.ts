import { MigrationInterface, QueryRunner } from 'typeorm';

export class PhysicalLocationRefactor1594039349864 implements MigrationInterface {
    name = 'PhysicalLocationRefactor1594039349864';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "postalLocationId" integer`, undefined);
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "UQ_95ed2854825d9f33c794e5ca293" UNIQUE ("postalLocationId")`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "location" ADD "type" character varying`, undefined);
        // Try figure out the physical vs postal addresses
        await queryRunner.query(`UPDATE "location" SET "type" = 'PostalLocation' where not "postOfficeBox" is null`, undefined);
        await queryRunner.query(`UPDATE "location" SET "type" = 'PhysicalLocation' where "postOfficeBox" is null`, undefined);
        // Migrate the account addresses
        await queryRunner.query(`update
        account
        set
            "postalLocationId" = "locationId",
            "locationId" = null
        where
            account."accountId" in (
            select
                "accountId"
            from
                account
            inner join location on
                location."locationId" = account."locationId"
            where
                location.type = 'PostalLocation')`);

        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "type" SET NOT NULL;`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f75de36d0d30611d95d6247fd1" ON "location" ("type") `, undefined);
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_95ed2854825d9f33c794e5ca293" FOREIGN KEY ("postalLocationId") REFERENCES "location"("locationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_95ed2854825d9f33c794e5ca293"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f75de36d0d30611d95d6247fd1"`, undefined);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_95ed2854825d9f33c794e5ca293"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "postalLocationId"`, undefined);
    }
}
