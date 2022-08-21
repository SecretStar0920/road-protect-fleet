import { Body, Controller, Get, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { UserType, Vehicle } from '@entities';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { Brackets } from 'typeorm';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AdvancedTableColumn, QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import * as moment from 'moment';
import { isNil } from 'lodash';
import { Transform } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { InfringementProjectionQueryService } from '@modules/graphing/services/infringement-projection-query.service';
import {
    GetInfringementProjectionDto,
    InfringementPredictionEndpoints,
} from '@modules/graphing/controllers/get-infringement-projection.dto';

export class VehicleCrudQueryDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    mine: string;

    @IsOptional()
    @IsIn([
        'all',
        'owned',
        'using',
        'infringementProjectionsContracts',
        'infringementProjectionsInfringements',
        'infringementProjectionsWithoutInfringements',
        'infringementProjectionsNoContracts',
    ])
    @ApiPropertyOptional({
        enum: [
            'all',
            'owned',
            'using',
            'infringementProjectionsContracts',
            'infringementProjectionsInfringements',
            'infringementProjectionsWithoutInfringements',
            'infringementProjectionsNoContracts',
        ],
    })
    via:
        | 'all'
        | 'owned'
        | 'using'
        | 'infringementProjectionsContracts'
        | 'infringementProjectionsInfringements'
        | 'infringementProjectionsWithoutInfringements'
        | 'infringementProjectionsNoContracts';

    @IsIn(['true', 'false'])
    @IsOptional()
    @Transform((val) => (!isNil(val) ? val : 'false'))
    @ApiPropertyOptional({ enum: ['true', 'false'], default: 'false' })
    graphing: string = 'false';

    @IsIn(['owner', 'user', 'hybrid'])
    @IsOptional()
    @ApiPropertyOptional({ enum: ['owner', 'user', 'hybrid'] })
    accountRole?: string;

    @IsOptional()
    @ApiPropertyOptional()
    startDate: string;

    @IsOptional()
    @ApiPropertyOptional()
    endDate: string;
}

@UseGuards(UserAuthGuard)
@Controller('query/vehicle')
@ApiBearerAuth()
@ApiTags('Vehicles')
export class VehicleQueryController extends QueryController {
    alias = 'vehicle';

    constructor(createDataSpreadsheetService: XlsxService, private infringementProjectionQueryService: InfringementProjectionQueryService) {
        super(createDataSpreadsheetService);
    }

    @ApiOperation({ summary: 'Query and filter vehicles' })
    @ApiResponse({ status: 200, type: [Vehicle] })
    @ApiResponse({ status: 500, description: 'Invalid query parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    async getMany(
        @ParsedRequest() req: CrudRequest,
        @Identity() identity: IdentityDto,
        @Query() query?: VehicleCrudQueryDto,
    ): Promise<PaginationResponseInterface<Vehicle>> {
        let baseQuery = Vehicle.findWithMinimalRelations()
            .leftJoinAndSelect('infringement.contract', 'infringementContract')
            .addSelect(['"infringementContract"."userId"', '"infringementContract"."ownerId"']);

        if ((query.graphing || '').toLowerCase() === 'true' && !isNil(query.startDate) && !isNil(query.endDate)) {
            const infringementProjectionData: GetInfringementProjectionDto = {
                dateRange: { startDate: query.startDate, endDate: query.endDate },
                endpoint: query.accountRole as InfringementPredictionEndpoints,
            };
            if (query.via === 'infringementProjectionsContracts') {
                baseQuery = this.infringementProjectionQueryService.getVehiclesWithValidContracts(
                    baseQuery,
                    identity.accountId,
                    infringementProjectionData,
                );
            } else if (query.via === 'infringementProjectionsWithoutInfringements') {
                baseQuery = this.infringementProjectionQueryService.getVehiclesWithoutInfringements(
                    baseQuery,
                    identity.accountId,
                    infringementProjectionData,
                );
            } else if (query.via === 'infringementProjectionsNoContracts') {
                baseQuery = await this.infringementProjectionQueryService.getVehiclesWithoutContracts(
                    baseQuery,
                    identity.accountId,
                    infringementProjectionData,
                );
            } else if (query.via === 'infringementProjectionsInfringements') {
                baseQuery = await this.infringementProjectionQueryService.getVehiclesWithInfringements(
                    baseQuery,
                    identity.accountId,
                    infringementProjectionData,
                );
            }
            return await PaginatedFilterQuery.paginatedFilterQuery<Vehicle>(req, baseQuery, 'vehicle');
        }

        // By default we only query vehicle relating to the account, unless an admin view specifies to see all
        query.mine = identity.user.type === UserType.Admin || identity.user.type === UserType.Developer ? query.mine : 'true';
        if (query.mine.toLowerCase() === 'true') {
            if (query.via === 'owned') {
                baseQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere('leaseOwner.accountId = :id', { id: identity.accountId });
                        qb.orWhere('owner.accountId = :id', { id: identity.accountId });
                    }),
                );
            } else if (query.via === 'using') {
                baseQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere('leaseUser.accountId = :id', { id: identity.accountId });
                    }),
                );
            } else {
                baseQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere('leaseUser.accountId = :id', { id: identity.accountId });
                        qb.orWhere('leaseOwner.accountId = :id', { id: identity.accountId });
                        qb.orWhere('owner.accountId = :id', { id: identity.accountId });
                    }),
                );
            }
        }
        return await PaginatedFilterQuery.paginatedFilterQuery<Vehicle>(req, baseQuery, 'vehicle');
    }

    @Post('spreadsheet')
    @UseInterceptors(CrudRequestInterceptor)
    @ApiBody({ type: [AdvancedTableColumn] })
    @ApiResponse({ status: 500, description: 'Invalid query parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E112_NoDataToExport.message() })
    async getManyAsSpreadsheet(
        @ParsedRequest() req: CrudRequest,
        @Identity() identity: IdentityDto,
        @Query() query: VehicleCrudQueryDto,
        @Res() res,
        @Body() body: AdvancedTableColumn[],
    ): Promise<any> {
        res.setHeader('Content-Disposition', `attachment; filename=filtered-vehicles-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        const spreadsheet = await this.returnGetManyAsSimpleSpreadsheet(arguments, body);
        res.status(200).send(spreadsheet);
    }
}
