import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { RedirectionData, RedirectionDetails, RedirectionIntegration } from '@integrations/crawlers/redirection.integration';

export class KfarSabaRedirectionDetails extends RedirectionDetails {
    @IsString()
    carNumber: string;
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

export class KfarSabaRedirectionData extends RedirectionData {
    @IsString()
    @IsOptional()
    ownerCity: string;
    @IsString()
    vehicleRegistration: string;
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
export class KfarSabaRedirectionIntegration extends RedirectionIntegration {
    constructor() {
        super(Integration.KfarSabaRedirectInfringement, crawlers.kfarSaba);
    }

    getBody(redirectionData: KfarSabaRedirectionData): KfarSabaRedirectionDetails {
        const body: KfarSabaRedirectionDetails = {
            redirectionDoc: redirectionData.redirectionDocument,
            userMail: redirectionData.requestingUserEmail,
            userPhone: redirectionData.requestingUserPhone,
            reportNumber: redirectionData.noticeNumber,
            carNumber: redirectionData.vehicleRegistration,
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

        return plainToClass(KfarSabaRedirectionDetails, body);
    }
}
