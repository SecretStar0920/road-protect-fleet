import { MigrationInterface, QueryRunner } from 'typeorm';

enum NominationStatus {
    Pending = 'Pending',
    Acknowledged = 'Acknowledged',
    InProcess = 'In Nomination Process', // RENAME: InNominationProcess
    Closed = 'Closed', // CLARIFY AS NOT APPLICABLE
    Approved = 'Approved for Payment', // RENAME: ApprovedForPayment
    Appealed = 'Appealed', // RENAME: AppealApproved
    ManuallyPaid = 'Manually Paid', // REMOVE
    Paid = 'Paid', // REMOVE
}

enum InfringementStatus {
    Due = 'Due',
    Outstanding = 'Outstanding', // Has penalties, is overdue latest payment date or is under warning from muni
    Paid = 'Paid',
    Closed = 'Closed',
    Pending = 'Pending', // REMOVE [Not set explicitly]
    AppealApproved = 'Appeal approved', // REMOVE [Only used in V1 mapper]
    Approved = 'Approved for payment', // REMOVE [Only used in V1 mapper]
    NominatedProcess = 'Nomination in process', // REMOVE [Only used in V1 mapper]
    Collection='Collection',
}

// Infringement Migrations
// A	AppealApproved	Remove and set nomination status to Acknowledged and infringement status to Due
// B	Approved	Remove and set nomination status to Approved and infringement status to Due
// C	NominatedProcess	Remove and set nomination status to InRedirectionProcess and infringement status to Due
// D	Pending	Remove and set infringement status to Due
//
// Nomination Migrations
// E	ManuallyPaid	Remove and set to Closed
// E	Paid	Remove and set to Closed make sure Infringement is set to Paid

export class StatusRefactor1597736537120 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.migrationA(queryRunner);
        await this.migrationB(queryRunner);
        await this.migrationC(queryRunner);
        await this.migrationD(queryRunner);
        await this.migrationE(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

    /**
     * Set infringement to due where status is appeal approved
     * Set nomination to appealed approved
     */
    async migrationA(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE nomination
            SET
            status = '${NominationStatus.Appealed}'
            WHERE "nomination"."nominationId" IN ( SELECT "nomination"."nominationId"
            FROM infringement
            INNER JOIN nomination on nomination."infringementId" = infringement."infringementId"
            WHERE infringement.status = '${InfringementStatus.AppealApproved}' )
        `);

        await queryRunner.query(`
            UPDATE infringement
            SET
            status = '${InfringementStatus.Due}'
            WHERE infringement."infringementId" IN ( SELECT "infringementId"
            FROM infringement
            WHERE infringement.status = '${InfringementStatus.AppealApproved}' )
        `);
    }

    /**
     * Set infringement to due where status is approved
     * Set nomination to approved
     */
    async migrationB(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE nomination
            SET
            status = '${NominationStatus.Approved}'
            WHERE "nomination"."nominationId" IN ( SELECT "nomination"."nominationId"
            FROM infringement
            INNER JOIN nomination on nomination."infringementId" = infringement."infringementId"
            WHERE infringement.status = '${InfringementStatus.Approved}' )
        `);

        await queryRunner.query(`
            UPDATE infringement
            SET
            status = '${InfringementStatus.Due}'
            WHERE infringement."infringementId" IN ( SELECT "infringementId"
            FROM infringement
            WHERE infringement.status = '${InfringementStatus.Approved}' )
        `);
    }

    /**
     * Set infringement to due where status is in process
     * Set nomination to in process
     */
    async migrationC(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE nomination
            SET
            status = '${NominationStatus.InProcess}'
            WHERE "nomination"."nominationId" IN ( SELECT "nomination"."nominationId"
            FROM infringement
            INNER JOIN nomination on nomination."infringementId" = infringement."infringementId"
            WHERE infringement.status = '${InfringementStatus.NominatedProcess}' )
        `);

        await queryRunner.query(`
            UPDATE infringement
            SET
            status = '${InfringementStatus.Due}'
            WHERE infringement."infringementId" IN ( SELECT "infringementId"
            FROM infringement
            WHERE infringement.status = '${InfringementStatus.NominatedProcess}' )
        `);
    }

    /**
     * Set nomination to acknowledged where status is pending
     */
    async migrationD(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE nomination
            SET
            status = '${NominationStatus.Acknowledged}'
            WHERE "nomination"."nominationId" IN ( SELECT "nomination"."nominationId"
            FROM infringement
            INNER JOIN nomination on nomination."infringementId" = infringement."infringementId"
            WHERE nomination.status = '${NominationStatus.Pending}' )
        `);
    }

    /**
     * Close nomination where status is paid or manually paid
     */
    async migrationE(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE nomination
            SET
            status = '${NominationStatus.Closed}'
            WHERE "nomination"."nominationId" IN ( SELECT "nomination"."nominationId"
            FROM infringement
            INNER JOIN nomination on nomination."infringementId" = infringement."infringementId"
            WHERE nomination.status IN ('${NominationStatus.Paid}', '${NominationStatus.ManuallyPaid}') )
        `);
    }
}
