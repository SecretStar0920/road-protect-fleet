import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { RedirectionData, RedirectionDetails, RedirectionIntegration } from '@integrations/crawlers/redirection.integration';

export class JerusalemRedirectionDetails extends RedirectionDetails {
    @IsString()
    @IsOptional()
    ownerCity: string;
    @IsString()
    @IsOptional()
    ownerStreet: string;
    @IsString()
    @IsOptional()
    customerId: string;
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
    custHomeNum: string;
}

export class JerusalemRedirectionData extends RedirectionData {
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
export class JerusalemRedirectionIntegration extends RedirectionIntegration {
    constructor() {
        super(Integration.JerusalemRedirectInfringement, crawlers.jerusalem);
    }

    getBody(redirectionData: JerusalemRedirectionData): JerusalemRedirectionDetails {
        const body: JerusalemRedirectionDetails = {
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

        return plainToClass(JerusalemRedirectionDetails, body);
    }
}
