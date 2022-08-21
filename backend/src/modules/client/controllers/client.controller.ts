import { Body, Controller, forwardRef, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateClientService } from '@modules/client/services/create-client.service';
import { IsString } from 'class-validator';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { Client } from '@entities';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

export class CreateClientDto {
    @IsString()
    name: string;
}

@Controller('client')
export class ClientController {
    constructor(
        @Inject(forwardRef(() => CreateClientService))
        private createClientService: CreateClientService,
    ) {}

    @Post()
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async createClient(@Body() dto: CreateClientDto): Promise<Client> {
        return this.createClientService.createClient(dto);
    }
}
