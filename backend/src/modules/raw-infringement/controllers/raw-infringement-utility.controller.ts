import { BadRequestException, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RawInfringementMapperService } from '@modules/raw-infringement/services/raw-infringement-mapper.service';
import { Client, RawInfringementStatus } from '@entities';
import { isNil } from 'lodash';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { AclGuard } from '@modules/auth/guards/acl.guard';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Controller('client/:clientId/utility')
@UseGuards(UserAuthGuard, SystemAdminGuard, AclGuard)
export class RawInfringementUtilityController {
    constructor(private mapper: RawInfringementMapperService) {}

    @Post('map')
    async mapClientInfringements(@Param('clientId') clientId: number) {
        const client = await Client.createQueryBuilder('client').where('client.clientId = :clientId', { clientId }).getOne();
        if (isNil(client)) {
            throw new BadRequestException({ message: ERROR_CODES.E096_CouldNotFindClient.message() });
        }

        return this.mapper.mapAndCreatePendingRawInfringements(client);
    }

    @Post('map/:status')
    async runPendingInfringement(@Param('status') status: RawInfringementStatus, @Param('clientId') clientId: number): Promise<void> {
        const client = await Client.createQueryBuilder('client').where('client.clientId = :clientId', { clientId }).getOne();
        if (isNil(client)) {
            throw new BadRequestException({ message: ERROR_CODES.E096_CouldNotFindClient.message() });
        }
        return await this.mapper.mapRawInfringementByStatus(status, client);
    }
}
