import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { RedirectionData, RedirectionDetails, RedirectionIntegration } from '@integrations/crawlers/redirection.integration';
import { IsOptional, IsString } from 'class-validator';

export class PoliceRedirectionDetails extends RedirectionDetails {
    @IsString()
    @IsOptional()
    custHomeNum: string;
    @IsString()
    @IsOptional()
    customerCity: string;
    @IsString()
    @IsOptional()
    customerId: string;
    @IsString()
    @IsOptional()
    customerName: string;
    @IsString()
    @IsOptional()
    customerStreet: string;
    @IsString()
    @IsOptional()
    ownerCity: string;
    @IsString()
    @IsOptional()
    ownerStreet: string;
}

export class PoliceRedirectionData extends RedirectionData {
    @IsString()
    @IsOptional()
    ownerCity: string;
    @IsString()
    @IsOptional()
    ownerStreet: string;
    @IsString()
    @IsOptional()
    customerBrn: string;
    @IsString()
    @IsOptional()
    customerName: string;
    @IsString()
    @IsOptional()
    customerCity: string;
    @IsString()
    @IsOptional()
    customerStreet: string;
    @IsString()
    @IsOptional()
    customerHomeNum: string;
}

@Injectable()
export class PoliceRedirectionIntegration extends RedirectionIntegration {
    constructor() {
        super(Integration.PoliceRedirectInfringement, crawlers.police);
    }

    getBody(redirectionData: PoliceRedirectionData): PoliceRedirectionDetails {
        const body: PoliceRedirectionDetails = {
            redirectionDoc: redirectionData.redirectionDocument,
            userMail: redirectionData.requestingUserEmail,
            userPhone: redirectionData.requestingUserPhone,
            reportNumber: redirectionData.noticeNumber,
            ownerId: redirectionData.ownerBrn,
            ownerName: redirectionData.ownerName,
            ownerCity: redirectionData.ownerCity,
            ownerStreet: redirectionData.ownerStreet,
            customerId: redirectionData.customerBrn,
            customerName: redirectionData.customerName,
            customerCity: redirectionData.customerCity,
            customerStreet: redirectionData.customerStreet,
            custHomeNum: redirectionData.customerHomeNum,
            custDrivingLicense: redirectionData.custDrivingLicense,
            driver: redirectionData.driver,
        };

        return plainToClass(PoliceRedirectionDetails, body);
    }
}
