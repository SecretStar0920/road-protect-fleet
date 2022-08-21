import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { RedirectionData, RedirectionDetails, RedirectionIntegration } from '@integrations/crawlers/redirection.integration';

export class MileonRedirectionDetails extends RedirectionDetails {
    @IsString()
    externalCode: string;
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
    customerPostOffice: string;
    @IsString()
    customerStreet: string;
    @IsString()
    @IsOptional()
    ownerCity: string;
    @IsString()
    @IsOptional()
    ownerStreet: string;
}

export class MileonRedirectionData extends RedirectionData {
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
    externalCode: string;
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
    customerPostOffice: string;
    @IsString()
    @IsOptional()
    customerHomeNum: string;
}

@Injectable()
export class MileonRedirectionIntegration extends RedirectionIntegration {
    constructor() {
        super(Integration.MileonRedirectInfringement, crawlers.mileon);
    }

    getBody(redirectionData: MileonRedirectionData): MileonRedirectionDetails {
        const body: MileonRedirectionDetails = {
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
            customerPostOffice: redirectionData.customerPostOffice,
            custHomeNum: redirectionData.customerHomeNum,
            externalCode: redirectionData.externalCode,
            custDrivingLicense: redirectionData.custDrivingLicense,
            driver: redirectionData.driver,
        };

        return plainToClass(MileonRedirectionDetails, body);
    }
}
