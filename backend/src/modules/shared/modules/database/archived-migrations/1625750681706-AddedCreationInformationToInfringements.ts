import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCreationInformationToInfringements1625750681706 implements MigrationInterface {
    name = 'AddedCreationInformationToInfringements1625750681706';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "infringement_creationmethod_enum" AS ENUM('Excel Upload', 'User', 'Crawler', 'Partial Infringement', 'Unknown')`,
        );
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD "creationMethod" "infringement_creationmethod_enum" NOT NULL DEFAULT 'Unknown'`,
        );
        await queryRunner.query(`ALTER TABLE "infringement" ADD "userId" integer`);
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD CONSTRAINT "FK_7b64645c278adfd83cfb637d516" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP CONSTRAINT "FK_7b64645c278adfd83cfb637d516"`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "creationMethod"`);
        await queryRunner.query(`DROP TYPE "infringement_creationmethod_enum"`);
    }
}
