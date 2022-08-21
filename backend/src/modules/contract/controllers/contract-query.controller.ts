import { Controller, Get, Query, Res, UseGuards, UseInterceptors, Post, Body } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { Contract, UserType } from '@entities';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Brackets } from 'typeorm';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AdvancedTableColumn, QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import * as moment from 'moment';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { isNil } from 'lodash';
import { SummaryIndicatorsQueryService } from '@modules/graphing/services/summary-indicators-query.service';
import { Transform } from 'class-transformer';

export class ContractCrudQueryDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    mine: string = 'true';

    @IsOptional()
    @Transform((val) => (val !== 'null' ? val : null))
    @ApiPropertyOptional()
    startDate?: string;

    @IsOptional()
    @Transform((val) => (val !== 'null' ? val : null))
    @ApiPropertyOptional()
    endDate?: string;

    @IsOptional()
    @Transform((val) => (val !== 'null' ? val : null))
    @ApiPropertyOptional({
        enum: ['managedVehicles'],
    })
    via?: string;

    @IsIn(['true', 'false'])
    @IsOptional()
    @ApiPropertyOptional()
    @Transform((val) => (!isNil(val) ? val : 'false'))
    @ApiProperty({ enum: ['true', 'false'], default: 'false' })
    graphing: string = 'false';
}

@UseGuards(UserAuthGuard)
@Controller('query/contract')
@ApiBearerAuth()
@ApiTags('Contracts')
export class ContractQueryController extends QueryController {
    alias = 'contract';

    constructor(createDataSpreadsheetService: XlsxService, private summaryIndicatorsQueryService: SummaryIndicatorsQueryService) {
        super(createDataSpreadsheetService);
    }

    @ApiOperation({ summary: 'Query and filter contracts' })
    @ApiResponse({ status: 200, type: [Contract] })
    @ApiResponse({ status: 500, description: 'Invalid query parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    async getMany(
        @ParsedRequest() req: CrudRequest,
        @Identity() identity: IdentityDto,
        @Query() query?: ContractCrudQueryDto,
    ): Promise<PaginationResponseInterface<Contract>> {
        let baseQuery = Contract.findWithMinimalRelations();

        // Only for the table on the graphing page
        if ((query.graphing || '').toLowerCase() === 'true') {
            if (query.via === 'managedVehicles') {
                baseQuery = this.summaryIndicatorsQueryService.getContracts(baseQuery, identity.accountId, query.startDate, query.endDate);
            }
            return await PaginatedFilterQuery.paginatedFilterQuery<Contract>(req, baseQuery, 'contract');
        }

        query.mine = identity.user.type === UserType.Admin || identity.user.type === UserType.Developer ? query.mine : 'true';
        if (query.mine.toLowerCase() === 'true') {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('user.accountId = :id', { id: identity.accountId });
                    qb.orWhere('owner.accountId = :id', { id: identity.accountId });
                }),
            );
        }
        return await PaginatedFilterQuery.paginatedFilterQuery<Contract>(req, baseQuery, 'contract');
    }

    @Post('spreadsheet')
    @ApiOperation({ summary: 'Query and filter contracts as a spreadsheet' })
    @ApiBody({ type: [AdvancedTableColumn] })
    @ApiResponse({ status: 400, description: ERROR_CODES.E112_NoDataToExport.message() })
    @ApiResponse({ status: 500, description: 'Invalid query parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseInterceptors(CrudRequestInterceptor)
    async getManyAsSpreadsheet(
        @ParsedRequest() req: CrudRequest,
        @Identity() identity: IdentityDto,
        @Query() query: ContractCrudQueryDto,
        @Res() res,
        @Body() body: AdvancedTableColumn[],
    ): Promise<any> {
        res.setHeader('Content-Disposition', `attachment; filename=filtered-contracts-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        const spreadsheet = await this.returnGetManyAsSimpleSpreadsheet(arguments, body);
        res.status(200).send(spreadsheet);
    }
}
