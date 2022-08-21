import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDriversEntity1621501028374 implements MigrationInterface {
    name = 'createDriversEntity1621501028374';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "driver" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "driverId" SERIAL NOT NULL, "name" text NOT NULL, "surname" text NOT NULL, "idNumber" text NOT NULL, "licenseNumber" text NOT NULL, "email" text NOT NULL, "cellphoneNumber" text, "physicalLocationId" integer, "postalLocationId" integer, CONSTRAINT "unique_id_number" UNIQUE ("idNumber"), CONSTRAINT "unique_driver_email" UNIQUE ("email"), CONSTRAINT "REL_662ca5cee70221ca8a47ec7983" UNIQUE ("physicalLocationId"), CONSTRAINT "REL_e321ca04c8a52687c3479e4f11" UNIQUE ("postalLocationId"), CONSTRAINT "PK_0e7092e101443d7b9ab132be154" PRIMARY KEY ("driverId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0e7092e101443d7b9ab132be15" ON "driver" ("driverId") `);
        await queryRunner.query(
            `ALTER TABLE "driver" ADD CONSTRAINT "FK_662ca5cee70221ca8a47ec79833" FOREIGN KEY ("physicalLocationId") REFERENCES "location"("locationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "driver" ADD CONSTRAINT "FK_e321ca04c8a52687c3479e4f11a" FOREIGN KEY ("postalLocationId") REFERENCES "location"("locationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "FK_e321ca04c8a52687c3479e4f11a"`);
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "FK_662ca5cee70221ca8a47ec79833"`);
        await queryRunner.query(`DROP INDEX "IDX_0e7092e101443d7b9ab132be15"`);
        await queryRunner.query(`DROP TABLE "driver"`);
    }
}
