import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { SingleSeries } from '@modules/shared/dtos/chart-data.model';
import { Account, Contract, ContractStatus, Infringement, InfringementStatus, Nomination, User, UserType, Vehicle } from '@entities';
import { Brackets } from 'typeorm';
import { NominationStatus } from '@modules/shared/models/nomination-status';
import * as moment from 'moment';
import { Config } from '@config/config';

@Injectable()
export class AccountSummaryReportingService {
    constructor(private logger: Logger) {}

    async getSummaryData(accountId: number): Promise<ReportingDataDto<SingleSeries>> {
        const account = await Account.findByIdentifierOrId(String(accountId));
        const data: ReportingDataDto<SingleSeries> = {
            data: [
                {
                    name: 'Users',
                    value: await User.createQueryBuilder('user')
                        .innerJoin('user.accounts', 'accounts')
                        .innerJoin('accounts.account', 'account')
                        .where('account.accountId = :accountId', { accountId })
                        .andWhere('user.type = :type', { type: UserType.Standard })
                        .cache(`${accountId}-user-count`, 1000 * 60)
                        .getCount(),
                },
                {
                    name: 'Vehicles Owned',
                    value: await Vehicle.createQueryBuilder('vehicle')
                        .leftJoin('vehicle.currentOwnershipContract', 'currentOwnershipContract')
                        .leftJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
                        .leftJoin('currentOwnershipContract.owner', 'owner')
                        .leftJoin('currentLeaseContract.owner', 'leaseOwner')
                        .where(
                            new Brackets((qb) => {
                                qb.andWhere('owner.accountId = :accountId', { accountId });
                                qb.orWhere('leaseOwner.accountId = :accountId', { accountId });
                            }),
                        )
                        // .cache(`${accountId}-vehicles-owned-count`, 1000 * 60)
                        .getCount(),
                },
                {
                    name: 'Fleet Vehicles',
                    value: await Vehicle.createQueryBuilder('vehicle')
                        .innerJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
                        .innerJoin('currentLeaseContract.user', 'user')
                        .where('user.accountId = :accountId', { accountId })
                        // .cache(`${accountId}-vehicles-fleet-count`, 1000 * 60)
                        .getCount(),
                },
                {
                    name: 'Valid Contracts',
                    value: await Contract.createQueryBuilder('contract')
                        .where('contract.status = :valid', { valid: ContractStatus.Valid })
                        .leftJoinAndSelect('contract.user', 'user')
                        .leftJoinAndSelect('contract.owner', 'owner')
                        .andWhere(
                            new Brackets((qb) => {
                                qb.andWhere('user.accountId = :accountId', { accountId });
                                qb.orWhere('owner.accountId = :accountId', { accountId });
                            }),
                        )
                        // .cache(`${accountId}-vehicles-owned-count`, 1000 * 60)
                        .getCount(),
                },
                {
                    name: 'Expiring Contracts',
                    value: await Contract.createQueryBuilder('contract')
                        .where('contract.status = :expiring', { expiring: ContractStatus.ExpiringSoon })
                        .leftJoinAndSelect('contract.user', 'user')
                        .leftJoinAndSelect('contract.owner', 'owner')
                        .andWhere(
                            new Brackets((qb) => {
                                qb.andWhere('user.accountId = :accountId', { accountId });
                                qb.orWhere('owner.accountId = :accountId', { accountId });
                            }),
                        )
                        // .cache(`${accountId}-contracts-expiring`, 1000 * 60)
                        .getCount(),
                },
                {
                    name: 'Outstanding Vehicle Infringements',
                    value: await Infringement.createQueryBuilder('infringement')
                        .leftJoin('infringement.contract', 'contract')
                        .leftJoin('contract.user', 'user')
                        .leftJoin('contract.owner', 'owner')
                        .where('infringement.status = :outstanding', {
                            outstanding: InfringementStatus.Outstanding,
                        })
                        // .andWhere('infringement.brn IS NOT NULL')
                        .andWhere(
                            new Brackets((qb) => {
                                qb.andWhere('user.accountId = :userId', { userId: accountId });
                                qb.orWhere('owner.accountId = :ownerId', { ownerId: accountId });
                                qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                            }),
                        )
                        // .cache(`${accountId}-inf-outstanding`, 1000 * 60)
                        .getCount(),
                },
                {
                    name: 'Outstanding Soon Vehicle Infringements',
                    value: await Infringement.createQueryBuilder('infringement')
                        .leftJoin('infringement.contract', 'contract')
                        .leftJoin('contract.user', 'user')
                        .leftJoin('contract.owner', 'owner')
                        .andWhere('infringement.status in (:...statuses)', {
                            statuses: [InfringementStatus.Due, InfringementStatus.ApprovedForPayment],
                        })
                        .andWhere('infringement.latestPaymentDate BETWEEN :startDate AND :endDate', {
                            startDate: moment().toISOString(),
                            endDate: moment().add(Config.get.infringement.defaultPaymentDays, 'days').toISOString(),
                        })
                        // .andWhere('infringement.brn IS NOT NULL')
                        .andWhere(
                            new Brackets((qb) => {
                                qb.andWhere('user.accountId = :userId', { userId: accountId });
                                qb.orWhere('owner.accountId = :ownerId', { ownerId: accountId });
                                qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                            }),
                        )
                        // .cache(`${accountId}-inf-outstanding`, 1000 * 60)
                        .getCount(),
                },
                {
                    name: 'Pending Nominations',
                    value: await Nomination.createQueryBuilder('nomination')
                        .innerJoin('nomination.account', 'account')
                        .where('nomination.status = :pending', {
                            pending: NominationStatus.Acknowledged,
                        })
                        .andWhere('account.accountId = :accountId', { accountId })
                        // .cache(`${accountId}-nomination-inf`, 1000 * 60)
                        .getCount(),
                },
                {
                    name: 'Acknowledged Nominations',
                    value: await Nomination.createQueryBuilder('nomination')
                        .innerJoin('nomination.account', 'account')
                        .where('nomination.status = :acknowledged', {
                            acknowledged: NominationStatus.Acknowledged,
                        })
                        .andWhere('account.accountId = :accountId', { accountId })
                        // .cache(`${accountId}-nomination-ack`, 1000 * 60)
                        .getCount(),
                },
                // This is no longer used
                // Nomination status no longer contains approved for payment, should look at infringement status

                // {
                //     name: 'Approved Nominations',
                //     value: await Nomination.createQueryBuilder('nomination')
                //         .innerJoin('nomination.account', 'account')
                //         .where('nomination.status = :approved', {
                //             approved: NominationStatus.ApprovedForPayment,
                //         })
                //         .andWhere('account.accountId = :accountId', { accountId })
                //         // .cache(`${accountId}-nomination-appr`, 1000 * 60)
                //         .getCount(),
                // },
            ],
        };

        return data;
    }
}
