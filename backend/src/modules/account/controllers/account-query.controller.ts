import { Body, Controller, Get, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { Account, UserType } from '@entities';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AdvancedTableColumn, QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import * as moment from 'moment';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@UseGuards(UserAuthGuard)
@Controller('query/account')
@ApiBearerAuth()
@ApiTags('Accounts')
export class AccountQueryController extends QueryController {
    alias = 'account';

    constructor(createDataSpreadsheetService: XlsxService) {
        super(createDataSpreadsheetService);
    }

    @ApiOperation({ summary: 'Query and filter accounts' })
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @ApiResponse({ status: 500, description: 'Invalid query parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 200, type: [Account] })
    async getMany(@ParsedRequest() req: CrudRequest, @Identity() identity: IdentityDto): Promise<PaginationResponseInterface<Account>> {
        const baseQuery = Account.findWithMinimalRelations();

        // Only admins can see all accounts
        if (!(identity.user.type === UserType.Admin || identity.user.type === UserType.Developer)) {
            baseQuery.andWhere('account.accountId = :id', { id: identity.accountId });
        }

        return await PaginatedFilterQuery.paginatedFilterQuery<Account>(req, baseQuery, 'account');
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
        @Res() res,
        @Body() body: AdvancedTableColumn[],
    ): Promise<any> {
        res.setHeader('Content-Disposition', `attachment; filename=filtered-accounts-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        const spreadsheet = await this.returnGetManyAsSimpleSpreadsheet(arguments, body);
        res.status(200).send(spreadsheet);
    }
}
