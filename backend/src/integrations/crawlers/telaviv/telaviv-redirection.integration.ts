import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { Default } from '@modules/shared/helpers/default.transform';
import { Injectable } from '@nestjs/common';
import { Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { RedirectionData, RedirectionDetails, RedirectionIntegration } from '@integrations/crawlers/redirection.integration';

export class TelavivRedirectionDetails extends RedirectionDetails {
    @IsString()
    @IsOptional()
    userFirstName: string;
    @IsString()
    @IsOptional()
    userLastName: string;
    @IsString()
    @IsOptional()
    userIdNumber: string;
    @IsString()
    carNumber: string;
    @IsString()
    customerId: string;
    @IsString()
    customerName: string;
    @IsString()
    customerCity: string;
    @IsString()
    customerStreet: string;
   

    // Using Ore's address as requested by client
    @Expose()
    @IsString()
    @Default('ראשון לציון')
    addressCity?: string;
    @Expose()
    @IsString()
    @Default('ניל"י')
    addressStreet?: string;
    @Expose()
    @IsString()
    @Default('1')
    addressStreetNum?: string;
    @Expose()
    @IsString()
    @Default('אצל גור גולדמור')
    addressComment?: string;
    @Expose()
    @IsString()
    @Default('נא להסב את הדוח')
    requestComment?: string;
}

export class TelavivRedirectionData extends RedirectionData {
    @IsString()
    @IsOptional()
    requestingUserName: string;
    @IsString()
    @IsOptional()
    requestingUserSurname: string;
    @IsString()
    @IsOptional()
    requestingUserId: string;
    @IsString()
    vehicleRegistration: string;
    @IsString()
    customerBrn: string;
    @IsString()
    customerName: string;
    @IsString()
    customerCity: string;
    @IsString()
    customerStreet: string;
}

@Injectable()
export class TelavivRedirectionIntegration extends RedirectionIntegration {
    constructor() {
        super(Integration.TelavivRedirectInfringement, crawlers.telaviv);
    }

    getBody(redirectionData: TelavivRedirectionData): TelavivRedirectionDetails {
        const body: TelavivRedirectionDetails = {
            redirectionDoc: redirectionData.redirectionDocument,
            userFirstName: redirectionData.requestingUserName,
            userLastName: redirectionData.requestingUserSurname,
            userIdNumber: redirectionData.requestingUserId,
            userMail: redirectionData.requestingUserEmail,
            userPhone: redirectionData.requestingUserPhone,
            ownerId: redirectionData.ownerBrn,
            ownerName: redirectionData.ownerName,
            carNumber: redirectionData.vehicleRegistration,
            reportNumber: redirectionData.noticeNumber,
            custDrivingLicense: redirectionData.custDrivingLicense,
            driver: redirectionData.driver,
            customerId: redirectionData.customerBrn,
            customerName: redirectionData.customerName,
            customerCity: redirectionData.customerCity,
            customerStreet: redirectionData.customerStreet,
        };
        return plainToClass(TelavivRedirectionDetails, body);
    }
}
