import { IIssuerStatusMap } from '@modules/infringement/helpers/status-mapper/interfaces/issuer-status-map.interface';
import { StatusCombinations } from '@modules/infringement/helpers/status-mapper/config/status-combinations';
import { InfringementStatus } from '@entities';
import { NominationStatus } from '@modules/shared/models/nomination-status';

export class IssuerStatusMap {
    static get get(): IIssuerStatusMap {
        return {
            // Active
            פעיל: StatusCombinations.get.defaultNew,
            // The conversion was sent to the municipality
            // 'הסבה נשלחה לעירייה': StatusCombinations.get.inRedirectionProcess,
            'הסבה נשלחה לעירייה': StatusCombinations.get.defaultNew,
            // Approved for payment
            'מאושר לתשלום': StatusCombinations.get.approvedForPayment,
            // Partially paid
            'שולם חלקי': StatusCombinations.get.defaultNew,
            // After notice of payment of a fine
            'לאחר הודעת תשלום קנס': StatusCombinations.get.defaultNew,
            // open
            פתוח: StatusCombinations.get.defaultNew,
            // Moved to outline
            'הועבר למתאר': StatusCombinations.get.defaultNew,
            // Reducing claims {WARN}
            'הפחתת תובע': StatusCombinations.get.defaultNew,
            // After dressing details {WARN}
            // 'לאחר הלבשת פרטים': StatusCombinations.get.inRedirectionProcess,
            'לאחר הלבשת פרטים': StatusCombinations.get.defaultNew,
            // Clearing situations
            'ניקוי מצבים': StatusCombinations.get.defaultNew,
            // Alerts {WARN}
            התראות: StatusCombinations.get.defaultNew,
            // priority
            עדיפות: StatusCombinations.get.defaultNew,
            // warning
            אזהרה: StatusCombinations.get.defaultNew,
            // enforcement
            אכיפה: StatusCombinations.get.defaultNew,
            // Notice of payment of a fine {WARN - should be paid?}
            'הודעת תשלום קנס': StatusCombinations.get.defaultNew,
            // Transfer to Habagia
            "העברה לחב'גביה": StatusCombinations.get.defaultNew,
            // A payment notification has been sent {WARN - should be paid?}
            'נשלחה הודעת תשלום': StatusCombinations.get.defaultNew,
            // Removal of foreclosure {WARN}
            'הסרת עיקול': StatusCombinations.get.approvedForPayment,
            // An appeal was granted {Changed infringement to due, since is it reduction in cost or closed?
            // 'ערעור התקבל': StatusCombinations.get.appealedSuccessfully,
            'ערעור התקבל': StatusCombinations.get.defaultNew,
            // A refund has been made {WARN} || Note, change infringement status to Due from AppealApproved, should it be Due or closed? Appeal is usually a reduction in cost
            // 'בוצע החזר כספי': StatusCombinations.get.appealedSuccessfully,
            'בוצע החזר כספי': StatusCombinations.get.defaultNew,
            // Conversion / change of details {Change infringement status from inProcess to due}
            // 'הסבה/שינוי פרטים': StatusCombinations.get.inRedirectionProcess,
            'הסבה/שינוי פרטים': StatusCombinations.get.defaultNew,
            // Conversion / change etc. {WARN} {Changed infringement from inProcess to Due}
            // 'הסבה/שנוי כו-טים': StatusCombinations.get.inRedirectionProcess,
            'הסבה/שנוי כו-טים': StatusCombinations.get.defaultNew,
            // After dressing rental {Changed infringement from inProcess to Due}
            // 'לאחר הלבשה השכרה': StatusCombinations.get.inRedirectionProcess,
            'לאחר הלבשה השכרה': StatusCombinations.get.defaultNew,
            // After dressing / grandfathering {Changed infringement from inProcess to Due}
            // 'לאחר הלבשה/הסב': StatusCombinations.get.inRedirectionProcess,
            'לאחר הלבשה/הסב': StatusCombinations.get.defaultNew,
            // In credit {WARN} {Changed infringement from inProcess to Due}
            // בזיכוי: StatusCombinations.get.inRedirectionProcess,
            בזיכוי: StatusCombinations.get.defaultNew,
            // Sent to a rental company {WARN} {Changed infringement from inProcess to Due}
            // 'נשלח לחברת השכרה': StatusCombinations.get.inRedirectionProcess,
            'נשלח לחברת השכרה': StatusCombinations.get.defaultNew,
            // closed
            סגור: StatusCombinations.get.closed,
            // canceled
            מבוטל: StatusCombinations.get.closed,
            // cancelation
            ביטול: StatusCombinations.get.closed,
            // Update vehicle details after cancellation {WARN}
            'עדכון פרטי רכב לאחר ביטול': StatusCombinations.get.closed,
            // paid up
            שולם: StatusCombinations.get.paidFully,
            // Fully paid
            'שולם מלא': StatusCombinations.get.paidFully,
            // Double fine
            'כפל קנס': StatusCombinations.get.defaultNew,
            // Second notice before foreclosure
            'התראה שנייה לפני עיקול': StatusCombinations.get.defaultNew,
            // First notice before foreclosure
            'התראה ראשונה לפני עיקול': StatusCombinations.get.defaultNew,
            // Delivery Alert-Execution
            'משלוח התראה-הוצאה לפועל': StatusCombinations.get.defaultNew,
            // Transfer to Gabia
            "העברה לחב' גביה": StatusCombinations.get.defaultNew,
            // Transferred to the back ward
            'הועבר למחלקת גב': StatusCombinations.get.defaultNew,
            Paid: StatusCombinations.get.paidFully,
            Outstanding: StatusCombinations.get.defaultNew,
            Due: StatusCombinations.get.defaultNew,
            Open: StatusCombinations.get.defaultNew,
            Closed: StatusCombinations.get.closed,
            [NominationStatus.InRedirectionProcess]: StatusCombinations.get.inRedirectionProcess,
            [NominationStatus.RedirectionCompleted]: StatusCombinations.get.appealedSuccessfully,
            [InfringementStatus.ApprovedForPayment]: StatusCombinations.get.approvedForPayment,
            /**
             * These are the inputs that admins can use in the spreadsheet to force a status change
             */
            INTERNAL_PAID: StatusCombinations.get.paidFully,
            INTERNAL_OUTSTANDING: StatusCombinations.get.defaultOutstanding,
            INTERNAL_DUE: StatusCombinations.get.defaultNew,
            INTERNAL_CLOSED: StatusCombinations.get.closed,
            INTERNAL_APPROVED_FOR_PAYMENT: StatusCombinations.get.approvedForPayment,
            INTERNAL_IN_REDIRECTION_PROCESS: StatusCombinations.get.inRedirectionProcess,
            INTERNAL_REDIRECTION_COMPLETED: StatusCombinations.get.appealedSuccessfully,
        };
    }
}
