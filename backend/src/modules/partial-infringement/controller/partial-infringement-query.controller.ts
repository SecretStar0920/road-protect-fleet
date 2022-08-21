import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { PartialInfringement } from '@entities';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

@UseGuards(UserAuthGuard)
@Controller('query/partial-infringement')
export class PartialInfringementQueryController extends QueryController {
    alias = 'partialInfringement';

    constructor(createDataSpreadsheetService: XlsxService) {
        super(createDataSpreadsheetService);
    }

    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @UseGuards(SystemAdminGuard)
    async getMany(@ParsedRequest() req: CrudRequest): Promise<PaginationResponseInterface<PartialInfringement>> {
        // Injecting sort for this query
        req.parsed.sort.push({ field: 'createdAt', order: 'DESC' });
        const baseQuery = PartialInfringement.findWithMinimalRelations();
        return await PaginatedFilterQuery.paginatedFilterQuery<PartialInfringement>(req, baseQuery, 'partialInfringement');
    }
}
