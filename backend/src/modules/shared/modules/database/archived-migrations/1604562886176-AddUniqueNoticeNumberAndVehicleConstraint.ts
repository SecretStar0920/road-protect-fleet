import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueNoticeNumberAndVehicleConstraint1604562886176 implements MigrationInterface {
    name = 'AddUniqueNoticeNumberAndVehicleConstraint1604562886176';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // TODO: This was manually run so as to prevent causing the db to become unresponsive
        await queryRunner.query(
            `ALTER TABLE "infringement" ADD CONSTRAINT "unique_vehicle_notice_number" UNIQUE ("noticeNumber", "vehicleId")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP CONSTRAINT "unique_vehicle_notice_number"`);
    }
}
