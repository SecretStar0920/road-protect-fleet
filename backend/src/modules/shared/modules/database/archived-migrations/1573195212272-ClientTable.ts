import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientTable1573195212272 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "client" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "clientId" SERIAL NOT NULL, "name" text NOT NULL, "token" text NOT NULL, "usageCount" integer NOT NULL DEFAULT 0, CONSTRAINT "UQ_aae03abb516847cddd1eb4cc8ff" UNIQUE ("token"), CONSTRAINT "unique_client_name" UNIQUE ("name"), CONSTRAINT "PK_6ed9067942d7537ce359e172ff6" PRIMARY KEY ("clientId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6ed9067942d7537ce359e172ff" ON "client" ("clientId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_6ed9067942d7537ce359e172ff"`);
        await queryRunner.query(`DROP TABLE "client"`);
    }
}
