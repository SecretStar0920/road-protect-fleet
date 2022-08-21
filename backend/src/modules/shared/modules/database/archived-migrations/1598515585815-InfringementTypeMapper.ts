import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementTypeMapper1598515585815 implements MigrationInterface {
    name = 'InfringementTypeMapper1598515585815';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE type_mapper_infringementtype_enum AS ENUM ('Parking', 'Traffic', 'Environmental', 'Other');`);
        await queryRunner.query(
            `CREATE TABLE "type_mapper" ("infringementTypeMapperId" SERIAL NOT NULL, "infringementTypeInText" text NOT NULL, "infringementTypeDisplay" text NOT NULL, "infringementType" "type_mapper_infringementtype_enum" NOT NULL, CONSTRAINT "PK_d858b40b8642a35f8e8f6a5dd7e" PRIMARY KEY ("infringementTypeMapperId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d858b40b8642a35f8e8f6a5dd7" ON "type_mapper" ("infringementTypeMapperId") `);
        await queryRunner.query(`INSERT INTO public.type_mapper ("infringementTypeInText","infringementTypeDisplay","infringementType") VALUES
            ('Parking','חנייה','Parking')
            ,('Traffic','תנועה','Traffic')
            ,('Environmental','סיירת ירוקה','Environmental')
            ,('Other','אחר','Other');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_d858b40b8642a35f8e8f6a5dd7"`);
        await queryRunner.query(`DROP TABLE "type_mapper"`);
    }
}
