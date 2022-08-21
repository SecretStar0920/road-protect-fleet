import { Body, Controller, Get, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { Account, Infringement, InfringementStatus, UserType } from '@entities';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Brackets } from 'typeorm';
import { IsIn, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { get, isEmpty, isNil, omit } from 'lodash';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AdvancedTableColumn, QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import * as moment from 'moment';
import { RateLimit, SetRateLimit } from '@modules/rate-limit/rate-limit.decorator';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { SummaryIndicatorsQueryService } from '@modules/graphing/services/summary-indicators-query.service';

export const infringementQueryDocumentation = `
<p>
  Using this endpoint you can request paginated and filtered infringements. You
  will only be able to see infringements linked to your account via the vehicles
  they are linked to
</p>
<h2>Parameter guide</h2>
<div>
  <h3>Filters</h3>
  <p>
    You can filter the results using query parameters with the following format:
  </p>
  <code>
    filter=FIELD||OPERATION||VALUE
  </code>
  <p>You can combine multiple filters to refine your result (see examples)</p>
  <h3>Order / Sorting</h3>
  <p>
    You can order the result by a specific column by adding a query param with
    the following format:
  </p>
  <code>sort=FIELD,ORDER</code>
  <h3>Pagination</h3>
    <p>You can select how many items per page you want and which page you want by using the following query parameters</p>
    <code>per_page=COUNT</code>
    <code>page=PAGE</code>
  <h3>Other Query Parameters</h3>
  <p>The query parameter <code>via</code> is used to simplify filtering infringements</p>
  <p>EG: <code>via=nominated</code> will return all infringements nominated to your account</p>
  <p>EG: <code>via=onVehicles</code> will return all infringements linked to vehicles you have used, regardless of whether they are nominated to you or not</p>
</div>
<h2>Examples</h2>
<p>
  Request infringements that contain the string "123" in their noticeNumber
  <br>
  <code>?filter=noticeNumber||cont||123</code>
</p>
<p>
  Request infringements that contain the string "123" in their noticeNumber and
  which have an offence date before 2000
  <br>
  <code
    >?filter=noticeNumber||cont||123&filter=offenceDate||lte||2000-01-01T00:00:00.000Z</code
  >
</p>
<p>
  Request the first 30 infringements created since a certain date
  <br>
  <code
    >?filter=createdAt||gt||2020-02-18T22:00:00.000Z&per_page=30&page=1</code
  >
</p>
`;

export class InfringementCrudQueryDto {
    @IsIn(['true', 'false'])
    @Transform((val) => (!isNil(val) ? val : 'true'))
    @ApiProperty({ enum: ['true', 'false'], default: 'true' })
    mine: string = 'true';

    @IsIn(['true', 'false'])
    @IsOptional()
    @ApiPropertyOptional()
    @Transform((val) => (!isNil(val) ? val : 'false'))
    @ApiProperty({ enum: ['true', 'false'], default: 'false' })
    graphing: string = 'false';

    @IsIn([
        'withBRN',
        'onVehicles',
        'noBRN',
        'vehicleUser',
        'vehicleOwner',
        'vehicleUserWithoutBrn',
        'vehicleOwnerWithoutBrn',
        'onVehiclesOrMine',
        'noContracts',
        'noLeaseDocument',
        'noOwner',
        'ownerInfringements',

    ])
    @IsOptional()
    @Transform((val) => (!isNil(val) ? val : 'withBRN'))
    @ApiPropertyOptional({
        enum: [
            'withBRN',
            'onVehicles',
            'noBRN',
            'vehicleUser',
            'vehicleOwner',
            'vehicleUserWithoutBrn',
            'vehicleOwnerWithoutBrn',
            'onVehiclesOrMine',
            'noContracts',
            'noLeaseDocument',
            'noOwner',
            'ownerInfringements',
        ],
        default: 'withBRN',
    })
    via: string = 'withBRN';

    @IsOptional()
    @ApiPropertyOptional()
    startDate: string;

    @IsOptional()
    @ApiPropertyOptional()
    endDate: string;

    @IsOptional()
    @ApiPropertyOptional()
    issuers: string[];

    @IsOptional()
    @ApiPropertyOptional()
    lastUpdatedWithin: string;

    @IsOptional()
    @ApiPropertyOptional()
    notUpdatedToday: string;

    @IsOptional()
    @ApiPropertyOptional()
    vehicleRegistration: string;

    @IsOptional()
    @ApiPropertyOptional({ enum: InfringementStatus })
    infringementStatus: InfringementStatus;
}

@UseGuards(UserAuthGuard)
@Controller('query/infringement')
@ApiBearerAuth()
@ApiTags('Infringements')
export class InfringementQueryController extends QueryController {
    alias = 'infringement';

    constructor(createDataSpreadsheetService: XlsxService, private summaryIndicatorsQueryService: SummaryIndicatorsQueryService) {
        super(createDataSpreadsheetService);
    }

    @ApiOperation({
        summary: 'Query and filter infringements',
        //     description: infringementQueryDocumentation,
    })
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @ApiResponse({ status: 200, type: [Infringement] })
    @ApiResponse({ status: 500, description: 'Invalid query parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMany(
        @ParsedRequest() req: CrudRequest,
        @Identity() identity: IdentityDto,
        @Query() query?: InfringementCrudQueryDto,
    ): Promise<PaginationResponseInterface<Infringement>> {
        let baseQuery = Infringement.findWithMinimalRelationsAndAccounts();

        // Only for the table on the graphing page
        if ((query.graphing || '').toLowerCase() === 'true') {
            // offence date is within specified date range
            if (!isNil(query.startDate) && !isNil(query.endDate)) {
                baseQuery.andWhere('infringement.offenceDate BETWEEN :startDate AND :endDate', {
                    startDate: query.startDate,
                    endDate: query.endDate,
                });
            }

            // only selected issuers are shown
            if (!isEmpty(query.issuers)) {
                if (typeof query.issuers === 'string') {
                    baseQuery.andWhere('issuer.name =:issuers', { issuers: query.issuers });
                } else {
                    baseQuery.andWhere('issuer.name IN (:...issuers)', { issuers: query.issuers });
                }
            }

            // only selected vehicles are shown
            if (!isNil(query.vehicleRegistration) && query.vehicleRegistration !== 'null' && query.vehicleRegistration !== 'undefined') {
                baseQuery.andWhere('vehicle.registration =:registration', { registration: query.vehicleRegistration });
            }

            // selected infringement status
            if (Object.values(InfringementStatus).includes(query.infringementStatus)) {
                baseQuery.andWhere('infringement.status =:status', { status: query.infringementStatus });
            }
        }

        // By default we only query infringements relating to the account, unless an admin view specifies to see all
        const mine = identity.user.type === UserType.Admin || identity.user.type === UserType.Developer ? query.mine : 'true';
        if (mine.toLowerCase() === 'true') {
            if (query.via === 'withBRN') {
                baseQuery.andWhere('infringement.brn IS NOT NULL').andWhere(
                    new Brackets((qb) => {
                        qb.andWhere('user.accountId = :userId', { userId: identity.accountId });
                        qb.orWhere('owner.accountId = :ownerId', { ownerId: identity.accountId });
                    }),
                );
            } else if (query.via === 'noBRN') {
                baseQuery.andWhere('infringement.brn IS NULL').andWhere(
                    new Brackets((qb) => {
                        qb.andWhere('user.accountId = :userId', { userId: identity.accountId });
                        qb.orWhere('owner.accountId = :ownerId', { ownerId: identity.accountId });
                    }),
                );
            } else if (query.via === 'vehicleUserWithoutBrn') {
                baseQuery.andWhere('user.accountId = :userId', { userId: identity.accountId });
            } else if (query.via === 'noOwner') {
                const account = await Account.findByIdentifierOrId(String(identity.accountId));
                baseQuery.andWhere('owner IS NULL');
                baseQuery.andWhere('infringement.brn = :brn', { brn: account.identifier });
            } else if (query.via === 'noOwner') {
                const account = await Account.findByIdentifierOrId(String(identity.accountId));
                baseQuery.andWhere('owner IS NULL');
                baseQuery.andWhere('infringement.brn = :brn', { brn: account.identifier });
            } else if (query.via === 'ownerInfringements') {
                const account = await Account.findByIdentifierOrId(String(identity.accountId));
                baseQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere(
                            new Brackets((qb1) => {
                                return qb1
                                    .andWhere('infringement.brn = :brn', { brn: account.identifier })
                                    .orWhere('infringement.brn IS NULL');
                            }),
                        );
                        qb.andWhere('owner.accountId = :userId', { userId: identity.accountId });
                    }),
                );
            }else if (query.via === 'vehicleOwnerWithoutBrn') {
                baseQuery.andWhere('owner.accountId = :accountId', { accountId: identity.accountId });
            } else if (query.via === 'vehicleUser') {
                const account = await Account.findByIdentifierOrId(String(identity.accountId));
                baseQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere('user.accountId = :userId', { userId: identity.accountId });
                        qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                    }),
                );
            } else if (query.via === 'vehicleOwner') {
                const account = await Account.findByIdentifierOrId(String(identity.accountId));
                baseQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere(
                            new Brackets((qb1) => {
                                return qb1
                                    .andWhere('owner.accountId = :userId', { userId: identity.accountId })
                                    .andWhere('infringement.brn IS NULL');
                            }),
                        );
                        qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                    }),
                );
            } else if (query.via === 'onVehicles') {
                const account = await Account.findByIdentifierOrId(String(identity.accountId));
                baseQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere('user.accountId = :userId', { userId: identity.accountId });
                        qb.orWhere('owner.accountId = :ownerId', { ownerId: identity.accountId });
                        qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                    }),
                );
            } else if (query.via === 'onVehiclesOrMine') {
                const account = await Account.findByIdentifierOrId(String(identity.accountId));
                baseQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere('user.accountId = :userId', { userId: identity.accountId });
                        qb.orWhere('owner.accountId = :ownerId', { ownerId: identity.accountId });
                        qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                    }),
                );
            } else if (query.via === 'noContracts') {
                baseQuery = await this.summaryIndicatorsQueryService.getInfringementsWithoutContracts(baseQuery, identity.accountId);
            }
        }

        // temp solution lastUpdatedWithin in Days
        if (!isEmpty(query.lastUpdatedWithin)) {
            if (typeof query.lastUpdatedWithin === 'string') {
                if (!isNil(query.lastUpdatedWithin)) {
                    let currentDate=Date.now();
                    let currentDay=new Date(currentDate);
                    let fromDate=new Date(currentDate);
                    fromDate.setDate(fromDate.getDate() - Number(query.lastUpdatedWithin) );
                    baseQuery.andWhere('infringement.externalChangeDate BETWEEN :startDate AND :endDate', {
                        startDate: fromDate.toISOString(),
                        endDate: currentDay.toISOString(),
                    });
                }
            }
        }

        // temp solution not updated today
        if (!isEmpty(query.notUpdatedToday)) {
            if (typeof query.notUpdatedToday === 'string') {
                if (!isNil(query.notUpdatedToday) && query.notUpdatedToday == 'true' ) {
                    let currentDate=Date.now();
                    let currentDay=new Date(currentDate);
                    let fromDate=new Date(currentDate);
                    fromDate.setDate(fromDate.getDate() - Number(query.lastUpdatedWithin) );
                    baseQuery.andWhere('infringement.externalChangeDate < :currentDay', {
                        currentDay: currentDay.toISOString(),
                    });
                }
            }
        }

        req.parsed.filter = req.parsed.filter.map((filter) => {
            if (filter.field === 'nomination.status') {
                const tempArray = [];
                filter.value.map((value) => {
                    if (value === 'New') {
                        tempArray.push('Pending');
                        tempArray.push('Acknowledged');
                    } else {
                        tempArray.push(value);
                    }
                });
                filter.value = tempArray;
            }
            return filter;
        });

        // Default sorting is by offence date descending
        if (isEmpty(req.parsed.sort)) {
            req.parsed.sort.push({ field: 'offenceDate', order: 'DESC' });
        }

        const paginatedResponse = await PaginatedFilterQuery.paginatedFilterQuery<Infringement>(req, baseQuery, this.alias);
        const data = paginatedResponse.data;

        const brnAccounts: { [brn: string]: Promise<Account> } = {};
        await Promise.all(
            data.map(async (infringement) => {
                // Remove payment details from infringement
                const details = get(infringement, 'payment.details');
                if (!isNil(details)) {
                    omit(infringement, ['payment.details']);
                }

                if (!isNil(infringement.brn)) {
                    let accountPromise = brnAccounts[infringement.brn]
                    if (isNil(accountPromise)) {
                        accountPromise = Account.findByIdentifierOrId(infringement.brn)
                        brnAccounts[infringement.brn] = accountPromise
                    }

                    infringement['brnAccount'] = await accountPromise;
                }
            }),
        );

        return paginatedResponse;
    }

    @Post('spreadsheet')
    @UseInterceptors(CrudRequestInterceptor)
    @SetRateLimit(RateLimitActions.infringementReport, 50)
    @RateLimit()
    @ApiBody({ type: [AdvancedTableColumn] })
    @ApiResponse({ status: 400, description: ERROR_CODES.E112_NoDataToExport.message() })
    @ApiResponse({ status: 500, description: 'Invalid query parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiOperation({ summary: 'Query and filter infringements as a spreadsheet' })
    async getManyAsSpreadsheet(
        @ParsedRequest() req: CrudRequest,
        @Identity() identity: IdentityDto,
        @Query() query: InfringementCrudQueryDto,
        @Res() res,
        @Body() body: AdvancedTableColumn[],
    ): Promise<any> {
        res.setHeader('Content-Disposition', `attachment; filename=filtered-infringements-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        const spreadsheet = await this.returnGetManyAsSimpleSpreadsheet(arguments, body);
        res.status(200).send(spreadsheet);
    }
}
