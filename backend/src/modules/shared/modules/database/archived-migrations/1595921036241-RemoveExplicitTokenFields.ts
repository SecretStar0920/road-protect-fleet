import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveExplicitTokenFields1595921036241 implements MigrationInterface {
    name = 'RemoveExplicitTokenFields1595921036241';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credit_guard_token" DROP COLUMN "cardToken"`, undefined);
        await queryRunner.query(`ALTER TABLE "credit_guard_token" DROP COLUMN "cardExp"`, undefined);
        await queryRunner.query(`ALTER TABLE "credit_guard_token" DROP COLUMN "cardHolderId"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credit_guard_token" ADD "cardHolderId" text`, undefined);
        await queryRunner.query(`ALTER TABLE "credit_guard_token" ADD "cardExp" text`, undefined);
        await queryRunner.query(`ALTER TABLE "credit_guard_token" ADD "cardToken" text`, undefined);
    }
}
