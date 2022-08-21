import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Driver } from '@entities';

@UseGuards(UserAuthGuard)
@Controller('query/driver')
export class DriverQueryController extends QueryController {
    alias = 'driver';

    constructor(createDataSpreadsheetService: XlsxService) {
        super(createDataSpreadsheetService);
    }

    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @UseGuards(SystemAdminGuard)
    async getMany(@ParsedRequest() req: CrudRequest): Promise<PaginationResponseInterface<Driver>> {
        // Injecting sort for this query
        req.parsed.sort.push({ field: 'createdAt', order: 'DESC' });
        const baseQuery = Driver.findWithMinimalRelations();
        return await PaginatedFilterQuery.paginatedFilterQuery<Driver>(req, baseQuery, 'driver');
    }
}
