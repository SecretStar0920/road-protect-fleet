/**
 * Extracts a reference from the ATG soap response if it can find the matches
 * @param response
 */
import { Payment } from '@entities';

export function extractAtgPaymentReference(payment: Payment) {
    try {
        const atgResponse =
            payment.details.result.result.response['soap:Envelope']['soap:Body']['ParkingPaymentsV3Response']['ParkingPaymentsV3Result'];
        const iskaNumMatches = /<IskaNumber>(\d+)<\/IskaNumber>/.exec(atgResponse);
        const dealNumMatches = /<ShvaDealNum>(\d+)<\/ShvaDealNum>/.exec(atgResponse);
        if (iskaNumMatches && dealNumMatches && iskaNumMatches[1] && dealNumMatches[1]) {
            return `IskaNumber:${iskaNumMatches[1]} / ShvaDealNum:${dealNumMatches[1]}`;
        }
        return null;
    } catch (e) {
        return null;
    }
}
