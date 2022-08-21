import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { Body, Controller, Get, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { Job } from '@entities';
import { PaginationResponseInterface } from '@modules/shared/dtos/pagination-response.interface';
import { PaginatedFilterQuery } from '@modules/shared/helpers/paginated-filter-query.helper';
import { AdvancedTableColumn, QueryController } from '@modules/shared/modules/crud/controllers/query.controller';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import * as moment from 'moment';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

@UseGuards(UserAuthGuard)
@Controller('query/job')
export class JobQueryController extends QueryController {
    alias = 'job';

    constructor(createDataSpreadsheetService: XlsxService) {
        super(createDataSpreadsheetService);
    }

    @Get()
    @UseGuards(SystemAdminGuard)
    @UseInterceptors(CrudRequestInterceptor)
    async getMany(@ParsedRequest() req: CrudRequest, @Identity() identity: IdentityDto): Promise<PaginationResponseInterface<Job>> {
        const baseQuery = Job.findWithMinimalRelations().addOrderBy('job.createdAt', 'DESC');
        return await PaginatedFilterQuery.paginatedFilterQuery<Job>(req, baseQuery, 'job');
    }

    @Post('spreadsheet')
    @UseGuards(SystemAdminGuard)
    @UseInterceptors(CrudRequestInterceptor)
    async getManyAsSpreadsheet(
        @ParsedRequest() req: CrudRequest,
        @Identity() identity: IdentityDto,
        @Res() res,
        @Body() body: AdvancedTableColumn[],
    ): Promise<any> {
        res.setHeader('Content-Disposition', `attachment; filename=filtered-jobs-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        const spreadsheet = await this.returnGetManyAsSimpleSpreadsheet(arguments, body);
        res.status(200).send(spreadsheet);
    }
}
