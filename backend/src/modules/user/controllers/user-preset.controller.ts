import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { UserPresetService } from '@modules/user/services/user-preset.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TablePreset, UserPreset } from '@entities';

export enum AdvancedTableNameEnum {
    contractTable = 'contractTable',
    infringementTable = 'infringementTable',
    vehicleTable = 'vehicleTable',
    accountUserTable = 'accountUserTable',
    relationTable = 'relationTable',
    reportTable = 'reportTable',
    userTable = 'userTable',
    accountsTable = 'accountsTable',
    nominationsTable = 'nominationsTable',
    issuerTable = 'issuerTable',
    paymentsTable = 'paymentsTable',
    driverTable = 'driverTable',
    integrationRequestLogsTable = 'integrationRequestLogsTable',
    jobLogsTable = 'jobLogsTable',
    rawInfringementLogsTable = 'rawInfringementLogsTable',
    infoRequestLogsTable = 'infoRequestLogsTable',
    partialInfringementTable = 'partialInfringementTable',
}

export class UpsertTablePresetDto {
    @IsOptional()
    @ApiProperty()
    id: number;
    @IsDefined()
    @ApiProperty()
    name: string;
    @IsDefined()
    @ApiProperty()
    filters: { [key: string]: any };
    @IsDefined()
    @ApiProperty()
    columns: string[];
    @IsDefined()
    @ApiProperty()
    default: boolean;
}

export class UpsertUserPresetDto {
    @IsDefined()
    @ApiProperty({ type: 'object', description: 'TablePreset' })
    preset: UpsertTablePresetDto;
    @IsDefined()
    @ApiProperty({ enum: AdvancedTableNameEnum })
    currentTable: AdvancedTableNameEnum;
}

@Controller('presets')
@UseGuards(UserAuthGuard)
export class UserPresetController {
    constructor(private userPresetService: UserPresetService) {}

    @Get()
    @UseGuards(UserAuthGuard)
    async getUserPreset(@Identity() identity: IdentityDto): Promise<UserPreset> {
        return this.userPresetService.getUserPreset(identity.user.userId);
    }

    @Post()
    @UseGuards(UserAuthGuard)
    async upsertUserPreset(@Body() dto: UpsertUserPresetDto, @Identity() identity: IdentityDto): Promise<UserPreset> {
        return this.userPresetService.upsertUserPreset(identity.user.userId, dto);
    }

    @Post('delete')
    @UseGuards(UserAuthGuard)
    async deleteUserPreset(@Body() dto: UpsertUserPresetDto, @Identity() identity: IdentityDto): Promise<UserPreset> {
        return this.userPresetService.deleteUserPreset(identity.user.userId, dto);
    }
}
