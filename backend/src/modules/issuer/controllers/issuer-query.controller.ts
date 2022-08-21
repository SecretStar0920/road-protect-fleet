import { Body, Controller, Get, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { Issuer } from '@entities';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { AdvancedTableColumn, QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import * as moment from 'moment';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

@UseGuards(UserAuthGuard)
@Controller('query/issuer')
export class IssuerQueryController extends QueryController {
    alias = 'issuer';

    constructor(createDataSpreadsheetService: XlsxService) {
        super(createDataSpreadsheetService);
    }

    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    async getMany(@ParsedRequest() req: CrudRequest, @Identity() identity: IdentityDto): Promise<PaginationResponseInterface<Issuer>> {
        // FIXME: insert base query
        const baseQuery = Issuer.findWithMinimalRelations();
        return await PaginatedFilterQuery.paginatedFilterQuery<Issuer>(req, baseQuery, 'issuer');
    }

    @Post('spreadsheet')
    @UseInterceptors(CrudRequestInterceptor)
    async getManyAsSpreadsheet(
        @ParsedRequest() req: CrudRequest,
        @Identity() identity: IdentityDto,
        @Res() res,
        @Body() body: AdvancedTableColumn[],
    ): Promise<any> {
        res.setHeader('Content-Disposition', `attachment; filename=filtered-issuers-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        const spreadsheet = await this.returnGetManyAsSimpleSpreadsheet(arguments, body);
        res.status(200).send(spreadsheet);
    }
}
