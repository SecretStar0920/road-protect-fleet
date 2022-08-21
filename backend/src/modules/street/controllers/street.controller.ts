import { Street } from '@entities';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { City, StreetService } from '@modules/street/services/street.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('street')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class StreetController {
    constructor(private streetService: StreetService) {}

    @Get('cities')
    async getCities(): Promise<string[]> {
        return await this.streetService.getCities();
    }

    @Get()
    async getStreetsByIssuer(@Query('issuer') issuer?: string): Promise<Street[]> {
        return await this.streetService.getStreets(null, issuer);
    }

    @Get(':street')
    async getStreetsByIssuerAndStreetName(@Param('street') street: string, @Query('issuer') issuer?: string): Promise<Street[]> {
        return await this.streetService.getStreets(street, issuer);
    }
}
