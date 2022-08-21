import { RawInfringement } from '@entities';
import { OldIsraelFleetRawInfringementDto } from '@modules/raw-infringement/services/client-mappers/old-israel-fleet/old-israel-fleet-raw-infringement.mapper';
import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class RawInfringementIdentifierService {
    /**
     * Get notice number from raw infringement
     */
    static getNoticeNumber(raw: RawInfringement) {
        // Old fleet system and crawlers
        if (!isNil(raw?.data?.fine_id)) {
            return raw.data.fine_id;
        }

        // ATG
        if (!isNil(raw?.data?.ticketNumber)) {
            return raw.data.ticketNumber;
        }

        // Manual Upload
        if (!isNil(raw?.data?.noticeNumber)) {
            return raw.data.noticeNumber;
        }

        return null;
    }

    /**
     * Get issuer from raw infringement
     */
    static getIssuer(raw: RawInfringement) {
        // Old fleet system
        if (!isNil(raw?.data?.fine_seq)) {
            return this.extractIssuerCodeFromFineSeq(raw.data);
        }

        // ATG
        if (!isNil(raw?.data?.customer)) {
            return raw.data.customer;
        }

        // Manual Insert
        if (!isNil(raw?.data?.issuer)) {
            return raw.data.issuer;
        }

        // Crawlers
        if (!isNil(raw?.data?.issuer_code)) {
            return raw.data.issuer_code;
        }

        return null;
    }

    /**
     * Extract issuer from fine sequence for old israel fleet service
     */
    static extractIssuerCodeFromFineSeq(oldIsraelFleetFine: OldIsraelFleetRawInfringementDto) {
        try {
            const issuerSeq = oldIsraelFleetFine.fine_seq.substr(0, 5);
            return `${Number(issuerSeq) - 10000}`;
        } catch (e) {
            return null;
        }
    }
}
