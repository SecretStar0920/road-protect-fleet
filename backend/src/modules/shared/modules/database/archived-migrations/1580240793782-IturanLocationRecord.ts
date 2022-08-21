import { MigrationInterface, QueryRunner } from 'typeorm';

export class IturanLocationRecord1580240793782 implements MigrationInterface {
    name = 'IturanLocationRecord1580240793782';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "ituran_location_record" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "recordId" SERIAL NOT NULL, "address" text NOT NULL, "lon" text NOT NULL, "lat" text NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "vehicleId" integer, CONSTRAINT "PK_1fbffaacabae8d01f549fb80657" PRIMARY KEY ("recordId"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_1fbffaacabae8d01f549fb8065" ON "ituran_location_record" ("recordId") `,
            undefined,
        );
        await queryRunner.query(`CREATE INDEX "IDX_85146efd08d5fbd6b400b84f8c" ON "ituran_location_record" ("date") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_7f2e53c3815821fc1e71b43b00" ON "ituran_location_record" ("vehicleId") `, undefined);
        await queryRunner.query(
            `ALTER TABLE "ituran_location_record" ADD CONSTRAINT "FK_7f2e53c3815821fc1e71b43b003" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("vehicleId") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "ituran_location_record" DROP CONSTRAINT "FK_7f2e53c3815821fc1e71b43b003"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_7f2e53c3815821fc1e71b43b00"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_85146efd08d5fbd6b400b84f8c"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_1fbffaacabae8d01f549fb8065"`, undefined);
        await queryRunner.query(`DROP TABLE "ituran_location_record"`, undefined);
    }
}
