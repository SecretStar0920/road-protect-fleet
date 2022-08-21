import { Body, Controller, Get, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { Payment } from '@entities';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AdvancedTableColumn, QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import * as moment from 'moment';

@UseGuards(UserAuthGuard)
@Controller('query/payment')
@ApiBearerAuth()
export class PaymentQueryController extends QueryController {
    alias = 'payment';

    constructor(createDataSpreadsheetService: XlsxService) {
        super(createDataSpreadsheetService);
    }

    @ApiOperation({ summary: 'Query and filter payments' })
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    async getMany(@ParsedRequest() req: CrudRequest): Promise<PaginationResponseInterface<Payment>> {
        const baseQuery = Payment.findWithMinimalRelations();
        return await PaginatedFilterQuery.paginatedFilterQuery<Payment>(req, baseQuery, 'payment');
    }

    @Post('spreadsheet')
    @UseInterceptors(CrudRequestInterceptor)
    async getManyAsSpreadsheet(@ParsedRequest() req: CrudRequest, @Res() res, @Body() body: AdvancedTableColumn[]): Promise<any> {
        res.setHeader('Content-Disposition', `attachment; filename=filtered-payments-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        const spreadsheet = await this.returnGetManyAsSimpleSpreadsheet(arguments, body);
        res.status(200).send(spreadsheet);
    }
}
