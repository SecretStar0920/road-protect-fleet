import { Body, Controller, forwardRef, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { IsIn } from 'class-validator';
import { spreadsheetEntities } from '@modules/shared/modules/spreadsheet/spreadsheet-export-entities';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import * as moment from 'moment';
import { ExportEntityAsSpreadsheetService } from '@modules/shared/modules/spreadsheet/services/export-entity-as-spreadsheet.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

export class ExportAsSpreadsheetDto {
    @IsIn(Object.keys(spreadsheetEntities))
    entity: string;
}

@Controller('spreadsheet')
@UseGuards(UserAuthGuard, SystemAdminGuard)
export class SpreadsheetController {
    constructor(
        @Inject(forwardRef(() => ExportEntityAsSpreadsheetService))
        private entityAsSpreadsheetService: ExportEntityAsSpreadsheetService,
    ) {}

    @Post('export')
    async exportEntityAsSpreadsheet(@Body() dto: ExportAsSpreadsheetDto, @Res() res) {
        const spreadsheet = await this.entityAsSpreadsheetService.export(dto);
        res.setHeader('Content-Disposition', `attachment; filename=${dto.entity}-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.status(200).send(spreadsheet);
    }

    @Post('export/all')
    async exportAllEntitiesAsSpreadsheet(@Res() res) {
        const spreadsheet = await this.entityAsSpreadsheetService.exportAllEntitiesToSpreadsheet();
        res.setHeader('Content-Disposition', `attachment; filename=road-protect-data-${moment().format('DD-MM-YYYY')}.xlsx`);
        res.status(200).send(spreadsheet);
    }
}
